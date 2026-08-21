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
    <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
      <figure className="border-t-2 border-[#9eaaa6] bg-[#f7f8f5]">
        <figcaption className="border-b border-[#cfd5d1] px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7675]">Figure 01 / Regression</p>
          <h3 className="mt-1 text-base font-medium text-[#202b2c]">Parameter response</h3>
          <p className="mt-1 text-xs leading-5 text-[#6b7574]">
          Scatter of station {CHART_PARAM_LABELS[chartParam]} vs health score
          with OLS regression line.
          </p>
        </figcaption>
        <div className="h-80 w-full px-3 py-5 sm:px-5">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
              <CartesianGrid stroke="#d9ddda" strokeDasharray="2 4" />
              <XAxis
                type="number"
                dataKey="x"
                name={CHART_PARAM_LABELS[chartParam]}
                stroke="#9aa5a1"
                tick={{ fill: "#66716f", fontSize: 10 }}
                domain={["auto", "auto"]}
                label={{
                  value: CHART_PARAM_LABELS[chartParam],
                  position: "insideBottom",
                  offset: -2,
                  fill: "#66716f",
                  fontSize: 10,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Health %"
                stroke="#9aa5a1"
                tick={{ fill: "#66716f", fontSize: 10 }}
                domain={[0, 100]}
                label={{
                  value: "Coral Health Score %",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#66716f",
                  fontSize: 10,
                }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #bfc7c2",
                  borderRadius: 0,
                  color: "#243031",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#65706e" }}
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
                fill="#286b73"
                fillOpacity={0.78}
              />
              {regression.length === 2 && (
                <Line
                  data={regression}
                  dataKey="y"
                  stroke="#a86539"
                  strokeWidth={1.5}
                  dot={false}
                  legendType="line"
                  name="OLS fit"
                  isAnimationActive={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <figure className="border-t-2 border-[#9eaaa6] bg-[#f7f8f5]">
        <figcaption className="border-b border-[#cfd5d1] px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7675]">Figure 02 / Comparison</p>
          <h3 className="mt-1 text-base font-medium text-[#202b2c]">Reference comparison</h3>
          <p className="mt-1 text-xs leading-5 text-[#6b7574]">
          Ideal Arctic CWC baseline (3°C, pH 8.1, 0 plastics) compared to
          current slider values.
          </p>
        </figcaption>
        <div className="h-80 w-full px-3 py-5 sm:px-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparison}
              margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
            >
              <CartesianGrid stroke="#d9ddda" strokeDasharray="2 4" />
              <XAxis
                dataKey="metric"
                stroke="#9aa5a1"
                tick={{ fill: "#66716f", fontSize: 10 }}
              />
              <YAxis
                stroke="#9aa5a1"
                tick={{ fill: "#66716f", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #bfc7c2",
                  borderRadius: 0,
                  color: "#243031",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#66716f" }}
              />
              <Bar
                dataKey="baseline"
                name="Baseline"
                fill="#8f9996"
                radius={[1, 1, 0, 0]}
              />
              <Bar
                dataKey="current"
                name="Current"
                fill="#286b73"
                radius={[1, 1, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </section>
  );
}
