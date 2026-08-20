"use client";

import {
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  Line,
  ComposedChart,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import type { ChartParam, OceanDataPoint, OceanParams } from "@/lib/coralModel";
import {
  CHART_PARAM_LABELS,
  buildComparisonBars,
  buildRegressionLine,
  buildScatterSeries,
} from "@/lib/coralModel";

type ChartsSectionProps = {
  data: OceanDataPoint[];
  chartParam: ChartParam;
  params: OceanParams;
};

export default function ChartsSection({
  data,
  chartParam,
  params,
}: ChartsSectionProps) {
  const scatter = buildScatterSeries(data, chartParam);
  const regression = buildRegressionLine(scatter);
  const comparison = buildComparisonBars(params);

  // Merge scatter + regression endpoints into one series for ComposedChart
  const scatterPlotData = [
    ...scatter.map((p) => ({
      x: p.x,
      y: p.y,
      lat: p.lat,
      lon: p.lon,
      type: "point" as const,
    })),
  ];

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <h3 className="mb-1 text-sm font-semibold text-slate-200">
          Parameter vs Coral Health
        </h3>
        <p className="mb-4 text-xs text-slate-500">
          Scatter of station {CHART_PARAM_LABELS[chartParam]} vs health score
          with OLS regression line.
        </p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={CHART_PARAM_LABELS[chartParam]}
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                domain={["auto", "auto"]}
                label={{
                  value: CHART_PARAM_LABELS[chartParam],
                  position: "insideBottom",
                  offset: -2,
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Health %"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                domain={[0, 100]}
                label={{
                  value: "Coral Health Score %",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value, name) => {
                  const num =
                    typeof value === "number"
                      ? value
                      : Number(value ?? 0);
                  if (name === "y" || name === "Health %") {
                    return [`${num.toFixed(1)}%`, "Health Score"];
                  }
                  return [num.toFixed(2), CHART_PARAM_LABELS[chartParam]];
                }}
              />
              <Scatter
                name="Stations"
                data={scatterPlotData}
                fill="#22d3ee"
                fillOpacity={0.85}
              />
              {regression.length === 2 && (
                <Line
                  data={regression}
                  dataKey="y"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  legendType="line"
                  name="OLS fit"
                  isAnimationActive={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <h3 className="mb-1 text-sm font-semibold text-slate-200">
          Baseline vs Current State
        </h3>
        <p className="mb-4 text-xs text-slate-500">
          Ideal Arctic CWC baseline (3°C, pH 8.1, 0 plastics) compared to
          current slider values.
        </p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparison}
              margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
            >
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis
                dataKey="metric"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
              />
              <Bar
                dataKey="baseline"
                name="Baseline"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="current"
                name="Current"
                fill="#22d3ee"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
