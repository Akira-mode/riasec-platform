import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ActiveUserGuard,
  AuthenticatedRequest,
} from '../assessments/guards/active-user.guard';
import { UsersService } from './users.service';
import { RiasecProfileResponseDto } from './dto/riasec-profile-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/profile')
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async getMyProfile(
    @Req() request: AuthenticatedRequest
  ): Promise<RiasecProfileResponseDto> {
    const currentUser = request.currentUser;

    if (!currentUser) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return this.usersService.getRiasecProfile(currentUser.id);
  }
}
