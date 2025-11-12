import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  currentUser?: {
    id: string;
    email: string;
    role: string;
    ageBracket: string | null;
    isActive: boolean;
  };
}

@Injectable()
export class ActiveUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const tokenPayload = request.user;

    if (!tokenPayload?.sub) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: tokenPayload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Compte non activé');
    }

    request.currentUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      ageBracket: user.ageBracket,
      isActive: user.isActive,
    };

    return true;
  }
}
