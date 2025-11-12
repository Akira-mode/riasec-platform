import { Assessment, AssessmentAnswer, AssessmentStatus, Question } from '@prisma/client';

export class AssessmentAnswerEntity {
  constructor(
    public readonly id: string,
    public readonly assessmentId: string,
    public readonly questionId: string,
    public readonly value: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static from(answer: AssessmentAnswer): AssessmentAnswerEntity {
    return new AssessmentAnswerEntity(
      answer.id,
      answer.assessmentId,
      answer.questionId,
      answer.value ?? null,
      answer.createdAt,
      answer.updatedAt
    );
  }
}

export class AssessmentEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly status: AssessmentStatus,
    public readonly startedAt: Date,
    public readonly completedAt: Date | null,
    public readonly currentQuestionIndex: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly answers: AssessmentAnswerEntity[]
  ) {}

  static from(
    assessment: Assessment & { answers?: AssessmentAnswer[] }
  ): AssessmentEntity {
    return new AssessmentEntity(
      assessment.id,
      assessment.userId,
      assessment.status,
      assessment.startedAt,
      assessment.completedAt ?? null,
      assessment.currentQuestionIndex,
      assessment.createdAt,
      assessment.updatedAt,
      Array.isArray(assessment.answers)
        ? assessment.answers.map(AssessmentAnswerEntity.from)
        : []
    );
  }
}

export class AssessmentQuestionEntity {
  constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly dimension: Question['dimension'],
    public readonly ageBrackets: Question['age_brackets'],
    public readonly difficulty: number | null,
    public readonly tags: string[],
    public readonly version: number
  ) {}

  static from(question: Question): AssessmentQuestionEntity {
    return new AssessmentQuestionEntity(
      question.id,
      question.text,
      question.dimension,
      question.age_brackets,
      question.difficulty ?? null,
      question.tags ?? [],
      question.version
    );
  }
}
