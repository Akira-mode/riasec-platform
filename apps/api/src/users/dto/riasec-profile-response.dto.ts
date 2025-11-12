import { Dimension } from '@prisma/client';
import { RiasecResultEntity } from '../../assessments/riasec-result.entity';

export interface RiasecHistoryEntry {
  assessmentId: string;
  profileCode: string;
  top3: Dimension[];
  scores: Record<Dimension, number>;
  normalized: Record<Dimension, number>;
  createdAt: Date;
}

export interface RiasecEvolution {
  [dimension: string]: number;
}

export class RiasecProfileResponseDto {
  constructor(
    public readonly latest: RiasecHistoryEntry | null,
    public readonly previous: RiasecHistoryEntry | null,
    public readonly evolution: RiasecEvolution | null,
    public readonly history: RiasecHistoryEntry[]
  ) {}

  static toHistoryEntry(result: RiasecResultEntity): RiasecHistoryEntry {
    return {
      assessmentId: result.assessmentId,
      profileCode: result.profileCode,
      top3: result.top3,
      scores: result.scores,
      normalized: result.normalized,
      createdAt: result.updatedAt ?? result.createdAt,
    };
  }
}
