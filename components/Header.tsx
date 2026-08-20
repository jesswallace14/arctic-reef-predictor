"use client";

import { Activity, Database, Waves } from "lucide-react";

type HeaderProps = {
  pointCount: number;
  dataSource: "mock" | "csv";
  healthScore: number;
};

export default function Header({
  pointCount,
  dataSource,
  healthScore,
}: HeaderProps) {
  const modelStatus =
    healthScore >= 70 ? "Stable" : healthScore >= 40 ? "Elevated risk" : "Alert";

  const statusColor =
    healthScore >= 70
      ? "text-emerald-400"
      : healthScore >= 40
        ? "text-amber-400"
        : "text-rose-400";

  return (
    <header className="border-b border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-400/80">
            GACHE · MVP
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            Greenland Arctic Coral Health Estimator
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Client-side proxy model for cold-water coral health from surface
            temperature, ocean pH, and microplastic density across offshore
            Greenland stations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <StatusChip
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Model"
            value={modelStatus}
            valueClassName={statusColor}
          />
          <StatusChip
            icon={<Database className="h-3.5 w-3.5" />}
            label="Stations"
            value={`${pointCount} · ${dataSource === "csv" ? "CSV" : "Mock"}`}
          />
          <StatusChip
            icon={<Waves className="h-3.5 w-3.5" />}
            label="Domain"
            value="59–78°N · 60–10°W"
          />
        </div>
      </div>
    </header>
  );
}

function StatusChip({
  icon,
  label,
  value,
  valueClassName = "text-slate-100",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
      <span className="text-cyan-400">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className={`font-medium ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
