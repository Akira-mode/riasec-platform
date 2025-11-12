import { Module } from '@nestjs/common';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService, QuestionService } from './assessments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ActiveUserGuard } from './guards/active-user.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AssessmentsController],
  providers: [AssessmentsService, QuestionService, ActiveUserGuard],
})
export class AssessmentsModule {}
