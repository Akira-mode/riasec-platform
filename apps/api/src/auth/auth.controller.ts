import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService, AuthResponse, AuthTokens, SignupResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

interface RefreshRequest {
  user: {
    userId: string;
    role: Role;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: RegisterDto): Promise<SignupResponse> {
    return this.authService.register(dto);
  }

  @Get('activate/:token')
  async activate(@Param('token') token: string): Promise<SignupResponse> {
    return this.authService.activateAccount(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: RefreshRequest): Promise<AuthTokens> {
    const { userId, role } = req.user;
    return this.authService.refreshTokens(userId, role);
  }
}
