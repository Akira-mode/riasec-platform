import { BadRequestException, Injectable } from '@nestjs/common';
import { Dimension } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface AnswerInput {
  questionId: string;
  value: number;
}

export interface RiasecScoreSummary {
  scores: Record<Dimension, number>;
  normalized: Record<Dimension, number>;
  top3: Dimension[];
  profileCode: string;
}

@Injectable()
export class ScoringService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateRiasecScores(answers: AnswerInput[]): Promise<RiasecScoreSummary> {
    if (!answers.length) {
      throw new BadRequestException('Aucune réponse fournie');
    }

    const questionIds = Array.from(new Set(answers.map((answer) => answer.questionId)));
    const questions = await this.prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    if (!questions.length) {
      throw new BadRequestException('Questions introuvables pour le calcul RIASEC');
    }

    const questionMap = new Map(questions.map((question) => [question.id, question]));
    const baseScores = this.initializeDimensionMap<number>(0);
    const maxPossibleScores = this.initializeDimensionMap<number>(0);

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);

      if (!question) {
        continue;
      }

      const clampedValue = this.clamp(answer.value, 1, 5);
      const weight = question.difficulty && question.difficulty > 3 ? 1.1 : 1;
      const weightedScore = Number((clampedValue * weight).toFixed(2));

      baseScores[question.dimension] += weightedScore;
      maxPossibleScores[question.dimension] += Number((5 * weight).toFixed(2));
    }

    const normalizedScores = this.initializeDimensionMap<number>(0);
    (Object.keys(baseScores) as Dimension[]).forEach((dimension) => {
      const raw = baseScores[dimension];
      const max = maxPossibleScores[dimension];
      normalizedScores[dimension] = max > 0 ? Number(((raw / max) * 100).toFixed(2)) : 0;
      baseScores[dimension] = Number(raw.toFixed(2));
    });

    const sortedDimensions = (Object.keys(normalizedScores) as Dimension[]).sort((a, b) => {
      const byNormalized = normalizedScores[b] - normalizedScores[a];
      if (byNormalized !== 0) {
        return byNormalized;
      }
      const byRaw = baseScores[b] - baseScores[a];
      if (byRaw !== 0) {
        return byRaw;
      }
      return a.localeCompare(b);
    });

    const top3 = sortedDimensions.slice(0, 3);
    const profileCode = top3.join('');

    return {
      scores: baseScores,
      normalized: normalizedScores,
      top3,
      profileCode,
    };
  }

  private initializeDimensionMap<T extends number>(initialValue: T): Record<Dimension, T> {
    return Object.values(Dimension).reduce((acc, dimension) => {
      acc[dimension] = initialValue;
      return acc;
    }, {} as Record<Dimension, T>);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
