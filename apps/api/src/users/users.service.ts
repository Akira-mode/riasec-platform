import { Injectable } from '@nestjs/common';
import { Dimension } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RiasecResultEntity } from '../assessments/riasec-result.entity';
import { RiasecProfileResponseDto } from './dto/riasec-profile-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getRiasecProfile(userId: string): Promise<RiasecProfileResponseDto> {
    const results = await this.prisma.riasecResult.findMany({
      where: {
        assessment: {
          userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        assessment: true,
      },
    });

    if (results.length === 0) {
      return new RiasecProfileResponseDto(null, null, null, []);
    }

    const entities = results.map(RiasecResultEntity.from);
    const history = entities.map(RiasecProfileResponseDto.toHistoryEntry);
    const latest = history[0];
    const previous = history[1] ?? null;
    const evolution = previous ? this.computeEvolution(latest.normalized, previous.normalized) : null;

    return new RiasecProfileResponseDto(latest, previous, evolution, history);
  }

  private computeEvolution(
    current: Record<Dimension, number>,
    previous: Record<Dimension, number>
  ): Record<Dimension, number> {
    const evolution: Record<Dimension, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };

    (Object.keys(evolution) as Dimension[]).forEach((dimension) => {
      const currentValue = current[dimension] ?? 0;
      const previousValue = previous[dimension] ?? 0;
      evolution[dimension] = Number((currentValue - previousValue).toFixed(2));
    });

    return evolution;
  }
}
