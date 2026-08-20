"use client";

import { HeartPulse, Atom, Ruler, AlertTriangle } from "lucide-react";
import type { CoralMetrics, StressLevel } from "@/lib/coralModel";

type MetricsGridProps = {
  metrics: CoralMetrics;
};

const STRESS_STYLES: Record<
  StressLevel,
  { badge: string; ring: string }
> = {
  Low: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    ring: "border-emerald-500/30",
  },
  Moderate: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/40",
    ring: "border-amber-500/30",
  },
  Critical: {
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/40",
    ring: "border-rose-500/30",
  },
};

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  const stress = STRESS_STYLES[metrics.stressLevel];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <MetricCard
        icon={<HeartPulse className="h-4 w-4 text-cyan-400" />}
        label="Coral Health Index Score"
        value={`${metrics.healthScore.toFixed(1)}%`}
        hint="0–100% · multivariate proxy"
      />
      <MetricCard
        icon={<Atom className="h-4 w-4 text-cyan-400" />}
        label="Aragonite Saturation State"
        value={metrics.omegaArag.toFixed(2)}
        hint="Ω_arag estimation from pH"
      />
      <MetricCard
        icon={<Ruler className="h-4 w-4 text-cyan-400" />}
        label="Calcification Extension Rate"
        value={`${metrics.extensionRate.toFixed(2)} mm/yr`}
        hint="max(0, 2.2 × (Ω_arag − 0.8))"
      />
      <div
        className={`rounded-xl border bg-slate-900/80 p-4 ${stress.ring}`}
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          <AlertTriangle className="h-4 w-4 text-cyan-400" />
          Environmental Stress Level
        </div>
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${stress.badge}`}
        >
          {metrics.stressLevel}
        </span>
        <p className="mt-3 text-xs text-slate-500">
          Low ≥70 · Moderate 40–69 · Critical &lt;40
        </p>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-100">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
