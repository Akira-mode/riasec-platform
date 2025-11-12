import { ScoringService } from './scoring.service';
import { PrismaService } from '../prisma/prisma.service';

type Dimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

interface Question {
  id: string;
  text: string;
  dimension: Dimension;
  age_brackets: string[];
  version: number;
  difficulty: number | null;
  tags: string[];
  createdAt: Date;
}

const QUESTION_BANK: Question[] = [
  // Réaliste
  { id: 'R1', text: 'Question R1', dimension: 'R', age_brackets: [], version: 1, difficulty: 3, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  { id: 'R2', text: 'Question R2', dimension: 'R', age_brackets: [], version: 1, difficulty: 2, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  // Investigateur
  { id: 'I1', text: 'Question I1', dimension: 'I', age_brackets: [], version: 1, difficulty: 4, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  { id: 'I2', text: 'Question I2', dimension: 'I', age_brackets: [], version: 1, difficulty: 3, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  // Artistique
  { id: 'A1', text: 'Question A1', dimension: 'A', age_brackets: [], version: 1, difficulty: 4, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  { id: 'A2', text: 'Question A2', dimension: 'A', age_brackets: [], version: 1, difficulty: 3, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  // Social
  { id: 'S1', text: 'Question S1', dimension: 'S', age_brackets: [], version: 1, difficulty: 3, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  { id: 'S2', text: 'Question S2', dimension: 'S', age_brackets: [], version: 1, difficulty: 2, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  // Entreprenant
  { id: 'E1', text: 'Question E1', dimension: 'E', age_brackets: [], version: 1, difficulty: 4, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  { id: 'E2', text: 'Question E2', dimension: 'E', age_brackets: [], version: 1, difficulty: 3, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  // Conventionnel
  { id: 'C1', text: 'Question C1', dimension: 'C', age_brackets: [], version: 1, difficulty: 3, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
  { id: 'C2', text: 'Question C2', dimension: 'C', age_brackets: [], version: 1, difficulty: 2, tags: [], createdAt: new Date('2024-01-01T00:00:00Z') },
];

describe('ScoringService', () => {
  let service: ScoringService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      question: {
        findMany: jest.fn().mockImplementation((params: { where?: { id?: { in: string[] } } }) => {
          if (!params?.where?.id?.in) {
            return Promise.resolve(QUESTION_BANK);
          }

          const ids = params.where.id.in;
          return Promise.resolve(
            QUESTION_BANK.filter((question) => ids.includes(question.id))
          );
        }),
      },
    } as unknown as PrismaService;

    service = new ScoringService(prisma);
  });

  it('calcule un profil artistique dominant', async () => {
    const result = await service.calculateRiasecScores([
      { questionId: 'A1', value: 5 },
      { questionId: 'A2', value: 4 },
      { questionId: 'S1', value: 4 },
      { questionId: 'S2', value: 3 },
      { questionId: 'E1', value: 3 },
      { questionId: 'E2', value: 2 },
    ]);

    expect(result.top3).toEqual(['A', 'S', 'E']);
    expect(result.profileCode).toBe('ASE');
    expect(result.normalized.A).toBeCloseTo(90.48, 2);
    expect(result.normalized.S).toBeCloseTo(70, 1);
    expect(result.normalized.E).toBeCloseTo(50.48, 2);
  });

  it('calcule un profil entreprenant équilibré', async () => {
    const result = await service.calculateRiasecScores([
      { questionId: 'E1', value: 5 },
      { questionId: 'E2', value: 4 },
      { questionId: 'C1', value: 5 },
      { questionId: 'C2', value: 4 },
      { questionId: 'S1', value: 3 },
      { questionId: 'S2', value: 3 },
    ]);

    expect(result.top3).toEqual(['E', 'C', 'S']);
    expect(result.profileCode).toBe('ECS');
    expect(result.normalized.E).toBeCloseTo(90.48, 2);
    expect(result.normalized.C).toBeCloseTo(90, 1);
    expect(result.normalized.S).toBeCloseTo(60, 1);
  });

  it('calcule un profil investigateur', async () => {
    const result = await service.calculateRiasecScores([
      { questionId: 'I1', value: 5 },
      { questionId: 'I2', value: 5 },
      { questionId: 'R1', value: 3 },
      { questionId: 'R2', value: 3 },
      { questionId: 'A1', value: 2 },
      { questionId: 'C1', value: 2 },
    ]);

    expect(result.top3).toEqual(['I', 'R', 'A']);
    expect(result.profileCode).toBe('IRA');
    expect(result.normalized.I).toBeCloseTo(100, 1);
    expect(result.normalized.R).toBeCloseTo(60, 1);
    expect(result.normalized.A).toBeCloseTo(40, 1);
  });
});
