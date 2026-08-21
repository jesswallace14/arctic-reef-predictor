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
    <aside className="space-y-7 border-t-2 border-[#9eaaa6] bg-[#f7f8f5] px-5 py-6 lg:sticky lg:top-6 lg:self-start">
      <div className="border-b border-[#cfd5d1] pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7675]">
          Scenario controls
        </p>
        <h2 className="mt-2 text-lg font-medium tracking-tight text-[#1b2728]">
          Surface conditions
        </h2>
        <p className="mt-2 text-xs leading-5 text-[#667170]">
          Adjust the inputs to recalculate the response estimate.
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
          className="mb-2 block text-xs font-medium text-[#4d5959]"
        >
          Scatter plot X-axis
        </label>
        <div className="relative">
          <select
            id="chart-param"
            value={chartParam}
            onChange={(e) => onChartParamChange(e.target.value as ChartParam)}
            className="w-full appearance-none border border-[#bfc7c2] bg-white py-2.5 pl-3 pr-12 text-sm text-[#202b2c] outline-none transition hover:border-[#9eaaa6] focus:border-[#286b73] focus:ring-1 focus:ring-[#286b73]"
          >
            {(Object.keys(CHART_PARAM_LABELS) as ChartParam[]).map((key) => (
              <option key={key} value={key}>
                {CHART_PARAM_LABELS[key]}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667473]"
          >
            <path
              d="m4 6 4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-[#4d5959]">
          Station data
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
          className={`border border-dashed px-4 py-5 text-center transition-colors ${
            dragActive
              ? "border-[#286b73] bg-[#e6efed]"
              : "border-[#aeb8b3] bg-white"
          }`}
        >
          <Upload className="mx-auto mb-2 h-4 w-4 text-[#286b73]" />
          <p className="text-xs text-[#64706f]">
            Drop a CSV file or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-medium text-[#286b73] underline underline-offset-2 hover:text-[#194f55]"
            >
              browse
            </button>
          </p>
          <p className="mt-2 font-mono text-[9px] text-[#818a87]">
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
          <p className="mt-2 text-xs text-[#286b73]">Parsing CSV…</p>
        )}
        {uploadError && (
          <p className="mt-2 text-xs text-[#a2453d]">{uploadError}</p>
        )}
        {dataSource === "csv" && (
          <button
            type="button"
            onClick={onResetData}
            className="mt-3 inline-flex items-center gap-1.5 text-left text-xs text-[#586464] underline-offset-2 hover:text-[#286b73] hover:underline"
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
        <label className="text-xs font-medium leading-4 text-[#4d5959]">{label}</label>
        <span className="border-b border-[#9eaaa6] px-1 font-mono text-xs font-medium text-[#214f54]">
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
        className="w-full cursor-pointer appearance-none accent-[#286b73]"
      />
      <div className="mt-0 flex justify-between font-mono text-[9px] text-[#858e8b]">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
