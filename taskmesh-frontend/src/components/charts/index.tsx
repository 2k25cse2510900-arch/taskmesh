import { clamp, cn } from "@/lib/utils";
import type { MetricPoint, SkillScore } from "@/types";

function chartPath(points: MetricPoint[], width: number, height: number) {
  if (!points.length) return "";
  const max = Math.max(...points.map((point) => point.value), 1);
  const min = Math.min(...points.map((point) => point.value), 0);
  const span = Math.max(max - min, 1);
  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point.value - min) / span) * (height - 16) - 8;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function MiniLineChart({ data, className }: { data: MetricPoint[]; className?: string }) {
  const width = 520;
  const height = 160;
  const path = chartPath(data, width, height);
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white p-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-950">Progress over time</p>
          <p className="text-xs text-slate-500">Consistency and completion are trending upward.</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">+18% this month</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-40 w-full">
        <defs>
          <linearGradient id="taskmeshLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="taskmeshFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(79,70,229,0.18)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0.02)" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((row) => (
          <line
            key={row}
            x1="0"
            x2={width}
            y1={Math.round((row / 3) * (height - 24)) + 12}
            y2={Math.round((row / 3) * (height - 24)) + 12}
            stroke="rgba(148,163,184,0.18)"
            strokeDasharray="4 8"
          />
        ))}
        <path d={area} fill="url(#taskmeshFill)" />
        <path d={path} fill="none" stroke="url(#taskmeshLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((point, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * width;
          const max = Math.max(...data.map((item) => item.value), 1);
          const min = Math.min(...data.map((item) => item.value), 0);
          const span = Math.max(max - min, 1);
          const y = height - ((point.value - min) / span) * (height - 16) - 8;
          return (
            <g key={point.label}>
              <circle cx={x} cy={y} r="5" fill="#fff" stroke="#4f46e5" strokeWidth="3" />
              <text x={x} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748b">
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function HorizontalBars({ data, className }: { data: SkillScore[]; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-950">Skill breakdown</p>
          <p className="text-xs text-slate-500">Compare your current level with your target.</p>
        </div>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.skill}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">{item.skill}</span>
              <span className="text-slate-500">
                {item.score}% <span className="text-emerald-600">(+{item.delta})</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-900" style={{ width: `${clamp(item.score, 0, 100)}%` }} />
              <div
                className="relative -mt-2 h-2 rounded-full bg-gradient-to-r from-indigo-500/65 to-violet-500/65"
                style={{ width: `${clamp(item.target, 0, 100)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>Now {item.score}%</span>
              <span>Target {item.target}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TinySpark({ data }: { data: number[] }) {
  const width = 140;
  const height = 42;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = Math.max(max - min, 1);
  const path = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-[140px]">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
