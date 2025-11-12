import { Dimension } from '@prisma/client';
import { RiasecResultEntity } from '../riasec-result.entity';

export interface AssessmentPublicUser {
  id: string;
  email: string;
  role: string;
  ageBracket: string | null;
}

export class AssessmentResultResponseDto {
  constructor(
    public readonly assessmentId: string,
    public readonly profileCode: string,
    public readonly top3: Dimension[],
    public readonly scores: Record<Dimension, number>,
    public readonly normalized: Record<Dimension, number>,
    public readonly createdAt: Date,
    public readonly user?: AssessmentPublicUser
  ) {}

  static from(
    result: RiasecResultEntity,
    user?: AssessmentPublicUser
  ): AssessmentResultResponseDto {
    return new AssessmentResultResponseDto(
      result.assessmentId,
      result.profileCode,
      result.top3,
      result.scores,
      result.normalized,
      result.updatedAt ?? result.createdAt,
      user
    );
  }
}
