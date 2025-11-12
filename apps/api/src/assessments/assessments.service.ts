import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AgeBracket,
  AssessmentStatus,
  Dimension,
  Prisma,
  Question,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  AssessmentEntity,
  AssessmentQuestionEntity,
} from './assessment.entity';
import { CreateAssessmentResponseDto } from './dto/create-assessment.dto';
import { AssessmentResultResponseDto, AssessmentPublicUser } from './dto/assessment-result.dto';
import { RiasecResultEntity } from './riasec-result.entity';

interface RedisLikeClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<void>;
}

type RedisLibrary = {
  createClient?: (options: { url: string }) => RedisLikeClient & {
    connect(): Promise<void>;
    on(event: string, listener: (...args: unknown[]) => void): void;
  };
};

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  private redisClientPromise: Promise<RedisLikeClient | null> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private async getRedisClient(): Promise<RedisLikeClient | null> {
    if (!process.env.REDIS_URL) {
      return null;
    }

    if (!this.redisClientPromise) {
      this.redisClientPromise = (async () => {
        try {
          const redisModule = (await import('redis')) as RedisLibrary;
          if (!redisModule.createClient) {
            this.logger.warn('Aucune fabrique Redis disponible, usage du cache mémoire.');
            return null;
          }
          const client = redisModule.createClient({ url: process.env.REDIS_URL });
          client.on('error', (error) =>
            this.logger.warn(`Redis error: ${error instanceof Error ? error.message : error}`)
          );
          await client.connect();
          this.logger.log('Redis client connecté pour QuestionService');
          return client as unknown as RedisLikeClient;
        } catch (error) {
          this.logger.warn(
            `Impossible de se connecter à Redis (${error instanceof Error ? error.message : error}). Retour en cache mémoire.`
          );
          return null;
        }
      })();
    }

    return this.redisClientPromise;
  }

  private buildCacheKey(ageBracket: AgeBracket | null, limit: number) {
    return `question-pool:${ageBracket ?? 'all'}:${limit}`;
  }

  private serializeQuestions(questions: Question[]): string {
    return JSON.stringify(
      questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
      }))
    );
  }

  private deserializeQuestions(serialized: string): Question[] {
    const raw = JSON.parse(serialized) as Array<Omit<Question, 'createdAt'> & { createdAt: string }>;
    return raw.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  }

  private shuffle<T>(items: T[]): T[] {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private ensureDimensionCoverage(
    primaryPool: Question[],
    fallbackPool: Question[],
    minimumPerDimension = 4
  ): Question[] {
    const byId = new Map<string, Question>();
    [...primaryPool, ...fallbackPool].forEach((question) => {
      if (!byId.has(question.id)) {
        byId.set(question.id, question);
      }
    });

    const pool = primaryPool.slice();
    const dimensions = Object.values(Dimension);

    for (const dimension of dimensions) {
      const currentCount = pool.filter((question) => question.dimension === dimension).length;
      if (currentCount >= minimumPerDimension) {
        continue;
      }

      const needed = minimumPerDimension - currentCount;
      const candidates = fallbackPool.filter(
        (question) => question.dimension === dimension && !pool.some((p) => p.id === question.id)
      );

      if (candidates.length < needed) {
        throw new InternalServerErrorException(
          `Nombre insuffisant de questions pour la dimension ${dimension}`
        );
      }

      pool.push(...candidates.slice(0, needed));
    }

    return pool;
  }

  private buildSelection(pool: Question[], limit: number): Question[] {
    const minimumRequired = Object.values(Dimension).length * 4;
    const target = Math.max(limit, minimumRequired);

    const buckets = new Map<Dimension, Question[]>();
    Object.values(Dimension).forEach((dimension) => buckets.set(dimension, []));

    pool.forEach((question) => {
      const bucket = buckets.get(question.dimension);
      if (bucket) {
        bucket.push(question);
      }
    });

    for (const dimension of Object.values(Dimension)) {
      const bucket = buckets.get(dimension) ?? [];
      if (bucket.length < 4) {
        throw new InternalServerErrorException(
          `Impossible de constituer un lot équilibré pour la dimension ${dimension}`
        );
      }
    }

    const selected: Question[] = [];
    for (const dimension of Object.values(Dimension)) {
      const bucket = buckets.get(dimension);
      if (!bucket) {
        continue;
      }
      const shuffledBucket = this.shuffle(bucket);
      selected.push(...shuffledBucket.slice(0, 4));
      buckets.set(dimension, shuffledBucket.slice(4));
    }

    const remaining = this.shuffle(Array.from(buckets.values()).flat());
    for (const question of remaining) {
      if (selected.length >= target) {
        break;
      }
      selected.push(question);
    }

    return selected.slice(0, target);
  }

  async getDynamicQuestions(ageBracket: AgeBracket | null, limit = 30): Promise<Question[]> {
    const cacheKey = this.buildCacheKey(ageBracket, limit);
    const redis = await this.getRedisClient();

    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const questions = this.deserializeQuestions(cached);
          if (questions.length) {
            return questions;
          }
        }
      } catch (error) {
        this.logger.warn(
          `Lecture cache Redis impossible (${error instanceof Error ? error.message : error})`
        );
      }
    }

    const filter: Prisma.QuestionWhereInput | undefined = ageBracket
      ? { age_brackets: { has: ageBracket } }
      : undefined;

    let primaryPool = await this.prisma.question.findMany({ where: filter });

    if (!primaryPool.length) {
      primaryPool = await this.prisma.question.findMany();
    }

    const fallbackPool = ageBracket
      ? await this.prisma.question.findMany()
      : primaryPool;

    const enrichedPool = this.ensureDimensionCoverage(primaryPool, fallbackPool);
    const shuffledPool = this.shuffle(enrichedPool);
    const selection = this.buildSelection(shuffledPool, limit);

    if (redis) {
      try {
        await redis.set(cacheKey, this.serializeQuestions(selection), { EX: 60 * 5 });
      } catch (error) {
        this.logger.warn(
          `Ecriture cache Redis impossible (${error instanceof Error ? error.message : error})`
        );
      }
    }

    return selection;
  }
}

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionService: QuestionService
  ) {}

  async startAssessmentForUser(
    user: { id: string; ageBracket: string | null }
  ): Promise<CreateAssessmentResponseDto> {
    const assessment = await this.prisma.assessment.create({
      data: {
        userId: user.id,
        status: AssessmentStatus.STARTED,
        startedAt: new Date(),
        currentQuestionIndex: 0,
      },
      include: { answers: true },
    });

    if (!assessment) {
      throw new InternalServerErrorException("Impossible de créer l'évaluation");
    }

    const questions = await this.questionService.getDynamicQuestions(
      (user.ageBracket as AgeBracket | null) ?? null,
      30
    );

    const assessmentEntity = AssessmentEntity.from(assessment);
    const questionEntities = questions.map(AssessmentQuestionEntity.from);

    return CreateAssessmentResponseDto.from(assessmentEntity, questionEntities);
  }

  async findById(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: { answers: true },
    });

    if (!assessment) {
      throw new NotFoundException("Session d'évaluation introuvable");
    }

    return AssessmentEntity.from(assessment);
  }

  async getAssessmentResult(assessmentId: string): Promise<AssessmentResultResponseDto> {
    const result = await this.prisma.riasecResult.findUnique({
      where: { assessmentId },
      include: {
        assessment: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                ageBracket: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException("Résultat introuvable pour cette évaluation");
    }

    const entity = RiasecResultEntity.from(result);
    const publicUser: AssessmentPublicUser | undefined = result.assessment?.user
      ? {
          id: result.assessment.user.id,
          email: result.assessment.user.email,
          role: result.assessment.user.role,
          ageBracket: result.assessment.user.ageBracket,
        }
      : undefined;

    return AssessmentResultResponseDto.from(entity, publicUser);
  }
}
