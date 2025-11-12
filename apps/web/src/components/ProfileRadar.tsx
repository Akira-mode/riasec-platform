'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { RiasecRadarChart, RiasecRadarPoint } from './RiasecRadarChart';

const DIMENSIONS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

export type RiasecHistoryEntry = {
  assessmentId: string;
  profileCode: string;
  top3: string[];
  scores: Record<string, number>;
  normalized: Record<string, number>;
  createdAt: string;
};

interface ProfileRadarProps {
  history: RiasecHistoryEntry[];
  evolution: Record<string, number> | null;
}

export function ProfileRadar({ history, evolution }: ProfileRadarProps) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(history[0]?.assessmentId ?? null);

  const selectedEntry = useMemo(() => {
    if (!selectedAssessmentId) return history[0];
    return history.find((entry) => entry.assessmentId === selectedAssessmentId) ?? history[0];
  }, [history, selectedAssessmentId]);

  const radarData: RiasecRadarPoint[] = useMemo(() => {
    if (!selectedEntry) return [];
    return DIMENSIONS.map((dimension) => ({
      dimension,
      value: Number((selectedEntry.normalized[dimension] ?? 0).toFixed(2)),
    }));
  }, [selectedEntry]);

  const trendData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((entry) => ({
        name: new Intl.DateTimeFormat('fr-FR').format(new Date(entry.createdAt)),
        ...entry.normalized,
      }));
  }, [history]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
      <section className="flex flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Profil actuel</h2>
            <p className="text-sm text-slate-400">Visualisez vos dimensions dominantes</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((entry) => (
              <button
                key={entry.assessmentId}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  entry.assessmentId === selectedEntry?.assessmentId
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setSelectedAssessmentId(entry.assessmentId)}
              >
                {new Intl.DateTimeFormat('fr-FR').format(new Date(entry.createdAt))}
              </button>
            ))}
          </div>
        </header>
        <RiasecRadarChart data={radarData} profileCode={selectedEntry?.profileCode ?? 'RIASEC'} />
        {selectedEntry && (
          <div className="rounded-2xl bg-slate-900/80 p-5 text-sm text-slate-300 shadow shadow-indigo-900/10">
            <p>
              Code Holland : <span className="font-semibold text-indigo-300">{selectedEntry.profileCode}</span>
            </p>
            <p className="mt-1">
              Top 3 :{' '}
              <span className="font-semibold text-indigo-300">{selectedEntry.top3.join(' - ') || 'Indisponible'}</span>
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6 rounded-2xl bg-slate-900/80 p-6 shadow shadow-indigo-900/10">
        <header>
          <h2 className="text-lg font-semibold text-slate-100">Tendance RIASEC</h2>
          <p className="text-sm text-slate-400">Évolution des scores normalisés sur vos tests</p>
        </header>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tickLine={false} width={30} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, borderColor: '#334155' }}
                formatter={(value: number | string, key) => [typeof value === 'number' ? `${value.toFixed(1)}%` : value, key]}
              />
              <Legend wrapperStyle={{ color: '#cbd5f5' }} />
              {DIMENSIONS.map((dimension) => (
                <Line
                  key={dimension}
                  type="monotone"
                  dataKey={dimension}
                  strokeWidth={2}
                  stroke={dimensionColorMap[dimension]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {evolution && (
          <div className="rounded-xl bg-slate-800/80 p-4 text-sm text-slate-300">
            <h3 className="text-sm font-semibold text-slate-100">Évolution vs test précédent</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
              {DIMENSIONS.map((dimension) => (
                <li key={dimension} className="flex items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2">
                  <span className="font-semibold text-slate-400">{dimension}</span>
                  <span className={evolution[dimension] >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                    {evolution[dimension] >= 0 ? '+' : ''}
                    {evolution[dimension]?.toFixed(1) ?? '0.0'}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

const dimensionColorMap: Record<string, string> = {
  R: '#1d4ed8',
  I: '#4338ca',
  A: '#db2777',
  S: '#0f766e',
  E: '#f97316',
  C: '#2563eb',
};
