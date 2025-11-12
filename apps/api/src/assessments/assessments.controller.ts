import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentResponseDto } from './dto/create-assessment.dto';
import {
  ActiveUserGuard,
  AuthenticatedRequest,
} from './guards/active-user.guard';
import { AssessmentResultResponseDto } from './dto/assessment-result.dto';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async create(@Req() request: AuthenticatedRequest): Promise<CreateAssessmentResponseDto> {
    const currentUser = request.currentUser;

    if (!currentUser) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return this.assessmentsService.startAssessmentForUser({
      id: currentUser.id,
      ageBracket: currentUser.ageBracket,
    });
  }

  @Get(':assessmentId/result')
  async getResult(
    @Param('assessmentId') assessmentId: string
  ): Promise<AssessmentResultResponseDto> {
    return this.assessmentsService.getAssessmentResult(assessmentId);
  }
}
