import { Dimension, RiasecResult } from '@prisma/client';

export interface RiasecResultSummary {
  scores: Record<Dimension, number>;
  normalized: Record<Dimension, number>;
  top3: Dimension[];
  profileCode: string;
}

export class RiasecResultEntity implements RiasecResultSummary {
  public readonly scores: Record<Dimension, number>;
  public readonly normalized: Record<Dimension, number>;
  public readonly top3: Dimension[];

  constructor(
    public readonly id: string,
    public readonly assessmentId: string,
    scores: Record<Dimension, number>,
    normalized: Record<Dimension, number>,
    top3: Dimension[],
    public readonly profileCode: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.scores = scores;
    this.normalized = normalized;
    this.top3 = top3;
  }

  static from(result: RiasecResult): RiasecResultEntity {
    const scores: Record<Dimension, number> = {
      R: result.scoreR,
      I: result.scoreI,
      A: result.scoreA,
      S: result.scoreS,
      E: result.scoreE,
      C: result.scoreC,
    };

    const normalized: Record<Dimension, number> = {
      R: result.normalizedR,
      I: result.normalizedI,
      A: result.normalizedA,
      S: result.normalizedS,
      E: result.normalizedE,
      C: result.normalizedC,
    };

    return new RiasecResultEntity(
      result.id,
      result.assessmentId,
      scores,
      normalized,
      result.top3 as Dimension[],
      result.profileCode,
      result.createdAt,
      result.updatedAt
    );
  }
}
