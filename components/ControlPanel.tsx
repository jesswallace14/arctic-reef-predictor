"use client";

import { useRef, useState } from "react";
import { Upload, RotateCcw } from "lucide-react";
import type { ChartParam, OceanParams } from "@/lib/coralModel";
import { CHART_PARAM_LABELS } from "@/lib/coralModel";

type ControlPanelProps = {
  params: OceanParams;
  chartParam: ChartParam;
  onParamsChange: (params: OceanParams) => void;
  onChartParamChange: (param: ChartParam) => void;
  onCsvUpload: (file: File) => Promise<void>;
  onResetData: () => void;
  dataSource: "mock" | "csv";
};

export default function ControlPanel({
  params,
  chartParam,
  onParamsChange,
  onChartParamChange,
  onCsvUpload,
  onResetData,
  dataSource,
}: ControlPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      await onCsvUpload(file);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to parse CSV.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <aside className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Surface ocean parameters
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Adjust conditions to estimate cold-water coral response.
        </p>
      </div>

      <SliderField
        label="Surface Water Temp (°C)"
        value={params.temp}
        min={-2}
        max={12}
        step={0.1}
        format={(v) => v.toFixed(1)}
        onChange={(temp) => onParamsChange({ ...params, temp })}
      />

      <SliderField
        label="Ocean pH"
        value={params.ph}
        min={7.4}
        max={8.2}
        step={0.01}
        format={(v) => v.toFixed(2)}
        onChange={(ph) => onParamsChange({ ...params, ph })}
      />

      <SliderField
        label="Microplastic Density (particles/m³)"
        value={params.microplastics}
        min={0}
        max={500}
        step={1}
        format={(v) => String(Math.round(v))}
        onChange={(microplastics) =>
          onParamsChange({ ...params, microplastics })
        }
      />

      <div>
        <label
          htmlFor="chart-param"
          className="mb-2 block text-xs font-medium text-slate-400"
        >
          Scatter plot X-axis
        </label>
        <select
          id="chart-param"
          value={chartParam}
          onChange={(e) => onChartParamChange(e.target.value as ChartParam)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
        >
          {(Object.keys(CHART_PARAM_LABELS) as ChartParam[]).map((key) => (
            <option key={key} value={key}>
              {CHART_PARAM_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-400">
          Station CSV upload
        </p>
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            void handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`rounded-lg border border-dashed px-4 py-6 text-center transition-colors ${
            dragActive
              ? "border-cyan-400 bg-cyan-950/30"
              : "border-slate-700 bg-slate-950/50"
          }`}
        >
          <Upload className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
          <p className="text-xs text-slate-400">
            Drop CSV or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-medium text-cyan-400 underline-offset-2 hover:underline"
            >
              browse
            </button>
          </p>
          <p className="mt-1 text-[10px] text-slate-600">
            Columns: lat, lon, temp, ph, microplastics
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
        </div>
        {uploading && (
          <p className="mt-2 text-xs text-cyan-400">Parsing CSV…</p>
        )}
        {uploadError && (
          <p className="mt-2 text-xs text-rose-400">{uploadError}</p>
        )}
        {dataSource === "csv" && (
          <button
            type="button"
            onClick={onResetData}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to mock Greenland stations
          </button>
        )}
      </div>
    </aside>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-slate-400">{label}</label>
        <span className="rounded border border-slate-700 bg-slate-950 px-2 py-0.5 font-mono text-xs text-cyan-300">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400"
      />
      <div className="mt-1 flex justify-between text-[10px] text-slate-600">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
