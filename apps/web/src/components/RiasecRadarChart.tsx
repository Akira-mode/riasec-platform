'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export type RiasecRadarPoint = {
  dimension: string;
  value: number;
};

interface RiasecRadarChartProps {
  data: RiasecRadarPoint[];
  profileCode: string;
}

const RADAR_COLORS: Record<string, string> = {
  R: '#1d4ed8',
  I: '#4338ca',
  A: '#db2777',
  S: '#0f766e',
  E: '#f97316',
  C: '#2563eb',
};

export function RiasecRadarChart({ data, profileCode }: RiasecRadarChartProps) {
  const stroke = RADAR_COLORS[profileCode[0]] ?? '#2563eb';

  return (
    <div className="h-80 w-full rounded-xl bg-slate-900/80 px-4 py-6 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#334155" strokeOpacity={0.4} />
          <PolarAngleAxis dataKey="dimension" stroke="#e2e8f0" tickLine={false} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#cbd5f5' }} tickCount={6} />
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            labelFormatter={(label) => `Dimension ${label}`}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12 }}
          />
          <Radar
            name="RIASEC"
            dataKey="value"
            stroke={stroke}
            fill={stroke}
            fillOpacity={0.45}
            animationBegin={200}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
