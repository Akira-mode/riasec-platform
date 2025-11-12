import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as sgMail from '@sendgrid/mail';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { activationEmailTemplate } from './templates/activation-email.template';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: Pick<User, 'id' | 'email' | 'role' | 'ageBracket' | 'isActive'>;
}

export interface SignupResponse {
  message: string;
}

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtl: JwtSignOptions['expiresIn'];
  private readonly refreshTtl: JwtSignOptions['expiresIn'];
  private readonly activationTtlMs: number;
  private readonly sendgridFrom?: string;
  private readonly clientBaseUrl: string;
  private readonly sendgridEnabled: boolean;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ?? 'access-secret';
    this.refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'refresh-secret';
    this.accessTtl =
      (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m') as JwtSignOptions['expiresIn'];
    this.refreshTtl =
      (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d') as JwtSignOptions['expiresIn'];

    this.activationTtlMs = Number(
      this.configService.get<string>('ACCOUNT_ACTIVATION_TTL_MS') ??
        1000 * 60 * 60 * 24
    );

    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    this.sendgridFrom = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    this.sendgridEnabled = Boolean(sendgridApiKey && this.sendgridFrom);

    if (sendgridApiKey) {
      sgMail.setApiKey(sendgridApiKey);
    }

    this.clientBaseUrl =
      this.configService.get<string>('CLIENT_BASE_URL') ??
      'http://localhost:3000';
  }

  async register(dto: RegisterDto): Promise<SignupResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email déjà utilisé');
    }

    const passwordHash = await hash(dto.password, 12);
    const activationToken = randomUUID();
    const activationExpires = new Date(Date.now() + this.activationTtlMs);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role ?? Role.etudiant,
        ageBracket: dto.ageBracket,
        activationToken,
        activationExpires,
        isActive: false,
      },
    });

    await this.sendActivationEmail(user.email, activationToken);

    return {
      message:
        'Compte créé. Vérifiez votre boîte mail pour activer votre compte.',
    };
  }

  async activateAccount(token: string): Promise<SignupResponse> {
    const user = await this.prisma.user.findFirst({
      where: { activationToken: token },
    });

    if (!user) {
      throw new BadRequestException("Token d'activation invalide");
    }

    if (user.isActive) {
      return { message: 'Compte déjà activé.' };
    }

    if (!user.activationExpires || user.activationExpires < new Date()) {
      throw new BadRequestException("Token d'activation expiré");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        activationToken: null,
        activationExpires: null,
      },
    });

    return { message: 'Compte activé avec succès.' };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Compte non activé');
    }

    const isValid = await compare(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const tokens = await this.generateTokens(user.id, user.role);
    await this.setRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async refreshTokens(userId: string, role: Role): Promise<AuthTokens> {
    const tokens = await this.generateTokens(userId, role);
    await this.setRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async validateRefreshToken(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Token invalide');
    }

    const matches = await compare(token, user.refreshTokenHash);

    if (!matches) {
      throw new UnauthorizedException('Token invalide');
    }

    return { userId: user.id, role: user.role };
  }

  private async sendActivationEmail(email: string, token: string) {
    if (!this.sendgridEnabled || !this.sendgridFrom) {
      return;
    }

    const clientRoot = this.clientBaseUrl.replace(/\/$/, '');
    const pathLink = `${clientRoot}/activate/${token}`;
    const queryLink = `${clientRoot}/activate?token=${token}`;
    const template = activationEmailTemplate(pathLink, queryLink);

    try {
      await sgMail.send({
        to: email,
        from: this.sendgridFrom,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      const stack = error instanceof Error ? error.stack : String(error);
      this.logger.error("Impossible d'envoyer l'email d'activation", stack, AuthService.name);
    }
  }

  private async setRefreshToken(userId: string, token: string) {
    const refreshTokenHash = await hash(token, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  private async generateTokens(userId: string, role: Role): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: this.accessTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshTtl,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const { id, email, role, ageBracket, isActive } = user;
    return { id, email, role, ageBracket, isActive };
  }
}
