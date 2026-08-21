"use client";

import type { CoralMetrics, StressLevel } from "@/lib/coralModel";

type MetricsGridProps = {
  metrics: CoralMetrics;
};

const STRESS_STYLES: Record<
  StressLevel,
  { text: string; dot: string }
> = {
  Low: {
    text: "text-[#286b73]",
    dot: "bg-[#286b73]",
  },
  Moderate: {
    text: "text-[#9a642f]",
    dot: "bg-[#b27a42]",
  },
  Critical: {
    text: "text-[#a2453d]",
    dot: "bg-[#a2453d]",
  },
};

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  const stress = STRESS_STYLES[metrics.stressLevel];

  return (
    <section className="border-t-2 border-[#9eaaa6] bg-[#f7f8f5]">
      <div className="flex items-baseline justify-between border-b border-[#cfd5d1] px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7675]">
            Model response
          </p>
          <h2 className="mt-1 text-lg font-medium tracking-tight">Current scenario</h2>
        </div>
        <p className="hidden text-xs text-[#74807e] sm:block">Updated from control inputs</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        <MetricCell label="Coral health index" value={`${metrics.healthScore.toFixed(1)}%`} hint="Scale: 0–100" primary />
        <MetricCell label="Aragonite saturation" value={metrics.omegaArag.toFixed(2)} hint="Estimated Ωarag" />
        <MetricCell label="Extension rate" value={metrics.extensionRate.toFixed(2)} unit="mm yr⁻¹" hint="Calcification proxy" />
        <div className="border-t border-[#cfd5d1] px-5 py-5 sm:border-l xl:border-t-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6f7977]">Stress classification</p>
          <div className={`mt-4 flex items-center gap-2 text-2xl font-medium tracking-tight ${stress.text}`}>
            <span className={`h-2 w-2 rounded-full ${stress.dot}`} />
            {metrics.stressLevel}
          </div>
          <p className="mt-3 text-[11px] leading-4 text-[#737d7b]">Low ≥70 / Moderate 40–69 / Critical &lt;40</p>
        </div>
      </div>
    </section>
  );
}

function MetricCell({
  label,
  value,
  unit,
  hint,
  primary = false,
}: {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  primary?: boolean;
}) {
  return (
    <div className="border-t border-[#cfd5d1] px-5 py-5 sm:odd:border-r xl:border-r xl:border-t-0 xl:last:border-r-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6f7977]">{label}</p>
      <p className={`mt-3 font-medium tracking-[-0.035em] text-[#1d292a] ${primary ? "text-4xl" : "text-3xl"}`}>
        {value}
        {unit && <span className="ml-2 text-xs font-normal tracking-normal text-[#6d7775]">{unit}</span>}
      </p>
      <p className="mt-3 text-[11px] text-[#737d7b]">{hint}</p>
    </div>
  );
}
