import { AssessmentEntity, AssessmentQuestionEntity } from '../assessment.entity';

export class CreateAssessmentRequestDto {
  /**
   * Placeholder pour d'éventuels paramètres futurs (ex: mode, langue…)
   * Laisser vide permet de conserver la validation stricte du pipe global.
   */
}

export class CreateAssessmentResponseDto {
  constructor(
    public readonly assessment: AssessmentEntity,
    public readonly questions: AssessmentQuestionEntity[]
  ) {}

  static from(
    assessment: AssessmentEntity,
    questions: AssessmentQuestionEntity[]
  ): CreateAssessmentResponseDto {
    return new CreateAssessmentResponseDto(assessment, questions);
  }
}
