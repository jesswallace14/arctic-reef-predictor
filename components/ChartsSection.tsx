"use client";

import type { ReactNode } from "react";
import Image from "next/image";
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
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import type {
  ChartParam,
  DriverTimelinePoint,
  OceanDataPoint,
  OceanParams,
} from "@/lib/coralModel";
import {
  CHART_PARAM_LABELS,
  buildAcidificationTimeline,
  buildMicroplasticTimeline,
  buildReefContextComparison,
  buildRegressionLine,
  buildScatterSeries,
  buildTemperatureTimeline,
} from "@/lib/coralModel";

type ChartsSectionProps = {
  data: OceanDataPoint[];
  chartParam: ChartParam;
  params: OceanParams;
};

type StationChartPoint = {
  x: number;
  y: number;
  lat: number;
  lon: number;
  temp: number;
  ph: number;
  microplastics: number;
};

const SOURCE_LINK_CLASS =
  "font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]";

export default function ChartsSection({
  data,
  chartParam,
  params,
}: ChartsSectionProps) {
  const scatter = buildScatterSeries(data, chartParam);
  const regression = buildRegressionLine(scatter);
  const comparison = buildReefContextComparison(params);
  const temperatureTimeline = buildTemperatureTimeline();
  const microplasticTimeline = buildMicroplasticTimeline();
  const acidificationTimeline = buildAcidificationTimeline();

  const scatterPlotData: StationChartPoint[] = scatter.map((point, index) => ({
    x: point.x,
    y: point.y,
    lat: point.lat,
    lon: point.lon,
    temp: data[index].temp,
    ph: data[index].ph,
    microplastics: data[index].microplastics,
  }));

  return (
    <div className="space-y-8">
      <section className="border-t-2 border-[#9eaaa6] bg-[#f7f8f5]">
        <div className="border-b border-[#cfd5d1] px-5 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6b7675]">
            Greenland reef outlook
          </p>
          <h2 className="mt-1 text-lg font-medium tracking-tight text-[#202b2c]">
            Estimated cold-water coral health over time
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-[#6b7574]">
            Each chart places its environmental driver on the left axis and the
            GACHE health estimate on the right. The health line now combines the
            temperature, acidification, and microplastic timelines using a
            nonlinear multi-stressor risk response.
          </p>
          <p className="mt-3 max-w-4xl text-[11px] leading-5 text-[#6b7574]">
            <span className="font-medium text-[#4d5959]">Model v2:</span>{" "}
            normalized logistic health = logistic(2.9 − cumulative risk), where
            risk combines thresholded thermal, acidification, and microplastic
            exposures plus their pairwise interactions. This structure follows
            coral prediction work that uses nonlinear thermal stress and
            multi-stressor effects; the Greenland-specific weights are transparent
            calibration assumptions, not field-fitted coefficients. {" "}
            <ExternalSource href="https://repository.library.noaa.gov/view/noaa/30978">NOAA heat-stress modelling</ExternalSource>{" "}
            and <ExternalSource href="https://academic.oup.com/ieam/article-abstract/17/1/165/7727069">multi-stressor Bayesian-network study</ExternalSource>.
          </p>
          <p className="mt-1 max-w-4xl text-[11px] leading-5 text-[#6b7574]">
            Stressor selection is grounded in cold-water coral experiments showing
            reduced skeletal growth under microplastic exposure and altered
            calcification under unfavorable acidification conditions. {" "}
            <ExternalSource href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6192985/">Microplastic experiment</ExternalSource>{" "}
            and <ExternalSource href="https://coastalscience.noaa.gov/data_reports/growth-and-feeding-of-deep-sea-coral-lophelia-pertusa-from-the-california-margin-under-simulated-ocean-acidification-conditions/">NOAA cold-water coral acidification study</ExternalSource>.
          </p>
        </div>

        <div className="grid gap-px bg-[#cfd5d1] xl:grid-cols-2 min-[1900px]:grid-cols-3">
          <TimeSeriesCard
            number="01"
            title="Surface temperature → deep-reef temperature"
            description="NOAA surface observations are adjusted to estimate 886–932 m reef water, where temperature changes far less than it does at the surface. This is a depth-buffered estimate, not a direct deep-water measurement."
            data={temperatureTimeline}
            driverName="Surface water temperature"
            driverUnit="°C"
            driverAxisLabel="Surface temperature (°C)"
            projectionStart={2026}
            driverDomain={[0, 10]}
            showDeepTemperature
            source={
              <>
                Observed surface values: <ExternalSource href="https://www.ncei.noaa.gov/products/optimum-interpolation-sst">NOAA OISST</ExternalSource>. Reef-depth temperature context: <ExternalSource href="https://link.springer.com/article/10.1007/s00300-016-1957-3">Meyer et al.</ExternalSource>.
              </>
            }
            note="The health line includes all three stressor trajectories. 2026 onward is a linear warming scenario, not an NOAA forecast."
          />
          <TimeSeriesCard
            number="02"
            title="Microplastic contamination"
            description="Published Greenland-water microplastic measurements are shown where observations exist. After the last measurement, the dashed line assumes a 6% yearly increase to illustrate a possible future exposure path; it is not a forecast."
            data={microplasticTimeline}
            driverName="Microplastics"
            driverUnit="particles/m³"
            driverAxisLabel="Microplastic density (particles per m³)"
            projectionStart={2026}
            driverDomain={[0, 500]}
            source={
              <>
                <ExternalSource href="https://arctic.noaa.gov/report-card/report-card-2018/microplastics-in-the-marine-realms-of-the-arctic-with-special-emphasis-on-sea-ice/">NOAA Arctic Report Card</ExternalSource> and <ExternalSource href="https://doi.org/10.1016/j.envpol.2020.115358">West Greenland 2019 observations</ExternalSource>.
              </>
            }
            note="The health line includes all three stressor trajectories. Sampling methods and particle-size thresholds differ between studies; points are not a harmonized monitoring record."
          />
          <TimeSeriesCard
            number="03"
            title="Ocean acidification"
            description="A Greenland Sea upper-ocean pH trend is reconstructed from the published 1981–2019 measured decline rate."
            data={acidificationTimeline}
            driverName="Ocean pH"
            driverUnit="pH"
            driverAxisLabel="Ocean pH"
            projectionStart={2020}
            driverDomain={[8.0, 8.16]}
            source={
              <>
                Trend source: <ExternalSource href="https://bg.copernicus.org/articles/19/979/2022/">Acidification of the Nordic Seas</ExternalSource> (Greenland Sea, 0–200 m).
              </>
            }
            note="The health line includes all three stressor trajectories. 2020 onward extends the observed −0.00219 pH/year trend; it is a scenario, not a climate-model forecast."
          />
          <ArcticContextPanel />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <figure className="border-t-2 border-[#9eaaa6] bg-[#f7f8f5]">
          <figcaption className="border-b border-[#cfd5d1] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7675]">
              Figure 04 / Station environmental relationship
            </p>
            <h3 className="mt-1 text-base font-medium text-[#202b2c]">
              Environmental conditions and estimated station health
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#6b7574]">
              Each dot is one station. Its health index is calculated with GACHE
              Model v2: surface temperature is converted to a deep-reef proxy,
              then combined with ocean pH and microplastic density in a nonlinear
              multi-stressor response. The line is an OLS fit through those station scores.
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
                  tick={{ fill: "#53605e", fontSize: 12 }}
                  domain={["auto", "auto"]}
                  height={42}
                  label={{
                    value: CHART_PARAM_LABELS[chartParam],
                    position: "insideBottom",
                    offset: -5,
                    fill: "#4d5959",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Health %"
                  stroke="#9aa5a1"
                  tick={{ fill: "#53605e", fontSize: 12 }}
                  domain={[0, 100]}
                  allowDataOverflow
                  tickCount={6}
                  tickFormatter={(value) => `${value}%`}
                  label={{
                    value: "Estimated coral health (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#4d5959",
                    fontSize: 12,
                  }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={<StationTooltip chartParam={chartParam} />}
                />
                <Scatter name="Stations" data={scatterPlotData} fill="#286b73" fillOpacity={0.78} />
                {regression.length === 2 && (
                  <Line
                    data={regression}
                    dataKey="y"
                    stroke="#a86539"
                    strokeWidth={1.5}
                    dot={false}
                    legendType="line"
                    name="OLS trend from station samples"
                    isAnimationActive={false}
                  />
                )}
                <Legend wrapperStyle={{ fontSize: 12, color: "#53605e" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </figure>

        <figure className="border-t-2 border-[#9eaaa6] bg-[#f7f8f5]">
          <figcaption className="border-b border-[#cfd5d1] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7675]">
              Figure 05 / Reference context
            </p>
            <h3 className="mt-1 text-base font-medium text-[#202b2c]">
              Arctic estimate and tropical reef context
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#6b7574]">
              This is not a like-for-like health ranking: GACHE&apos;s Arctic value is a
              modelled 0–100 index, while the tropical value is measured global
              live hard-coral cover. It is shown to give the estimate ecological context.
            </p>
          </figcaption>
          <div className="h-80 w-full px-3 py-5 sm:px-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="#d9ddda" strokeDasharray="2 4" />
                <XAxis
                  dataKey="metric"
                  stroke="#9aa5a1"
                  tick={{ fill: "#53605e", fontSize: 12 }}
                  interval={0}
                  height={55}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#9aa5a1"
                  tick={{ fill: "#53605e", fontSize: 12 }}
                  label={{
                    value: "Index / percent",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#4d5959",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, "Value"]}
                />
                <Bar dataKey="value" name="Reference value" radius={[1, 1, 0, 0]}>
                  {comparison.map((item) => (
                    <Cell key={item.metric} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="px-5 pb-5 text-xs leading-5 text-[#6b7574]">
            Global tropical live hard-coral cover was 29.5% in 2019, after an
            estimated 14% loss since 2009. <ExternalSource href="https://gcrmn.net/2020-report/">Source: GCRMN Status of Coral Reefs of the World</ExternalSource>.
          </p>
        </figure>
      </section>
    </div>
  );
}

function ArcticContextPanel() {
  return (
    <aside className="bg-[#f7f8f5] p-5" aria-label="Greenland reef and fjord imagery">
      <div className="flex h-full min-h-[34rem] flex-col gap-6">
        <figure className="flex min-h-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#dce3df]">
            <Image
              src="/about/greenland-soft-coral-garden.jpg"
              alt="Cold-water corals on the Greenland seafloor"
              fill
              sizes="(min-width: 1900px) 31vw, (min-width: 1280px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="pt-3 text-xs leading-5 text-[#5d6968]">
            <span className="font-medium text-[#263031]">Arctic reef life.</span> A Greenland cold-water coral garden.
          </figcaption>
        </figure>
        <figure className="flex min-h-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#dce3df]">
            <Image
              src="/about/carousel-2.jpg"
              alt="Zodiac approaching a southern Greenland fjord"
              fill
              sizes="(min-width: 1900px) 31vw, (min-width: 1280px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="pt-3 text-xs leading-5 text-[#5d6968]">
            <span className="font-medium text-[#263031]">Southern Greenland fjord.</span> A Zodiac approach along the expedition route.
          </figcaption>
        </figure>
      </div>
    </aside>
  );
}

function StationTooltip({
  active,
  payload,
  chartParam,
}: {
  active?: boolean;
  payload?: Array<{ payload?: StationChartPoint }>;
  chartParam: ChartParam;
}) {
  const point = payload?.find((item) => item.payload?.temp !== undefined)?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="border border-[#bfc7c2] bg-white px-3 py-2.5 text-xs leading-5 text-[#354444] shadow-sm">
      <p className="font-medium text-[#1d292a]">
        Estimated coral health: {point.y.toFixed(1)}%
      </p>
      <p className="mt-1 text-[#5e6b69]">
        {CHART_PARAM_LABELS[chartParam]}: {point.x.toFixed(chartParam === "ph" ? 2 : 1)}
        {chartParam === "temp" ? " °C" : chartParam === "microplastics" ? " particles/m³" : ""}
      </p>
      <div className="mt-2 border-t border-[#dde1de] pt-2 text-[#4d5959]">
        <p>Surface temperature: {point.temp.toFixed(1)} °C</p>
        <p>Ocean pH: {point.ph.toFixed(2)}</p>
        <p>Microplastic density: {point.microplastics.toFixed(0)} particles/m³</p>
      </div>
      <p className="mt-2 text-[11px] text-[#6b7574]">
        {point.lat.toFixed(2)}°N, {Math.abs(point.lon).toFixed(2)}°W
      </p>
    </div>
  );
}

function TimeSeriesCard({
  number,
  title,
  description,
  data,
  driverName,
  driverUnit,
  driverAxisLabel,
  driverDomain,
  projectionStart,
  source,
  note,
  showDeepTemperature = false,
}: {
  number: string;
  title: string;
  description: string;
  data: DriverTimelinePoint[];
  driverName: string;
  driverUnit: string;
  driverAxisLabel: string;
  driverDomain: [number, number];
  projectionStart: number;
  source: ReactNode;
  note: string;
  showDeepTemperature?: boolean;
}) {
  return (
    <figure className="bg-[#f7f8f5]">
      <figcaption className="border-b border-[#cfd5d1] px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6b7675]">
          Figure {number}
        </p>
        <h3 className="mt-1 text-base font-medium leading-5 text-[#202b2c]">{title}</h3>
        <p className="mt-2 text-xs leading-5 text-[#6b7574]">{description}</p>
      </figcaption>
      <div className="px-3 py-5 sm:px-5">
        <div className="mb-2 flex items-end justify-between gap-4 px-6 text-[11px] font-medium">
          <p className="text-[#1f626a]">Environmental attribute: {driverAxisLabel}</p>
          <p className="shrink-0 text-[#9b5c36]">Estimated reef health (%)</p>
        </div>
        <div className="relative h-72 w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-6 items-center justify-center">
            <span className="-rotate-90 whitespace-nowrap text-[12px] font-medium text-[#1f626a]">
              {driverAxisLabel}
            </span>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-6 items-center justify-center">
            <span className="rotate-90 whitespace-nowrap text-[12px] font-medium text-[#9b5c36]">
              Estimated reef health (%)
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 24, right: 26, bottom: 10, left: 26 }}>
            <CartesianGrid stroke="#d9ddda" strokeDasharray="2 4" />
            <XAxis
              dataKey="year"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: "#53605e", fontSize: 12 }}
              stroke="#9aa5a1"
              tickFormatter={(year) => String(year)}
              height={54}
              label={{
                value: "Year",
                position: "insideBottom",
                offset: -2,
                fill: "#4d5959",
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId="driver"
              domain={driverDomain}
              stroke="#286b73"
              tick={{ fill: "#1f626a", fontSize: 12 }}
              width={82}
            />
            <YAxis
              yAxisId="health"
              orientation="right"
              domain={[0, 100]}
              stroke="#b36f43"
              tick={{ fill: "#9b5c36", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              width={82}
            />
            <ReferenceLine
              x={projectionStart}
              yAxisId="driver"
              stroke="#8b9691"
              strokeDasharray="3 3"
              label={{ value: "Projected", position: "top", fill: "#4d5959", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value, name, item) => {
                const number = Number(value ?? 0);
                if (String(name).includes("Health")) {
                  return [`${number.toFixed(1)}%`, String(name)];
                }
                if (showDeepTemperature && item?.payload?.deepTemp && String(name).includes("Surface")) {
                  return [`${number.toFixed(2)} ${driverUnit} (deep proxy: ${item.payload.deepTemp.toFixed(2)} °C)`, String(name)];
                }
                return [`${number.toFixed(driverUnit === "pH" ? 3 : 1)} ${driverUnit}`, String(name)];
              }}
            />
            <Line
              yAxisId="driver"
              dataKey="observedDriver"
              name={`${driverName} observed`}
              stroke="#286b73"
              strokeWidth={2}
              dot={{ r: 2.5, fill: "#286b73" }}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="driver"
              dataKey="projectedDriver"
              name={`${driverName} projected`}
              stroke="#286b73"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 2.5, fill: "#f7f8f5", stroke: "#286b73", strokeWidth: 1.5 }}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="health"
              dataKey="observedHealth"
              name="Estimated health observed period"
              stroke="#b36f43"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="health"
              dataKey="projectedHealth"
              name="Estimated health projected period"
              stroke="#b36f43"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <TimelineLegend driverName={driverName} />
      </div>
      <div className="border-t border-[#cfd5d1] px-5 py-4 text-[11px] leading-5 text-[#6b7574]">
        <p>{source}</p>
        <p className="mt-2 text-[#7a8381]">{note}</p>
      </div>
    </figure>
  );
}

function TimelineLegend({ driverName }: { driverName: string }) {
  return (
    <div
      className="mt-5 grid gap-x-4 gap-y-2 border-t border-[#e0e4e1] pt-4 text-[11px] leading-4 text-[#53605e] sm:grid-cols-2"
      aria-label="Chart legend"
    >
      <LegendItem color="#b36f43" label="Estimated health — observed" />
      <LegendItem color="#b36f43" dashed label="Estimated health — projected" />
      <LegendItem color="#286b73" dot label={`${driverName} — observed`} />
      <LegendItem color="#286b73" dashed dot hollowDot label={`${driverName} — projected`} />
    </div>
  );
}

function LegendItem({
  color,
  label,
  dashed = false,
  dot = false,
  hollowDot = false,
}: {
  color: string;
  label: string;
  dashed?: boolean;
  dot?: boolean;
  hollowDot?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <svg aria-hidden="true" className="shrink-0" height="14" viewBox="0 0 28 14" width="28">
        <line
          stroke={color}
          strokeDasharray={dashed ? "5 4" : undefined}
          strokeWidth="2"
          x1="1"
          x2="27"
          y1="7"
          y2="7"
        />
        {dot && (
          <circle
            cx="14"
            cy="7"
            fill={hollowDot ? "#f7f8f5" : color}
            r="3"
            stroke={color}
            strokeWidth="2"
          />
        )}
      </svg>
      <span>{label}</span>
    </div>
  );
}

function ExternalSource({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={SOURCE_LINK_CLASS}>
      {children} ↗
    </a>
  );
}

const TOOLTIP_STYLE = {
  backgroundColor: "#ffffff",
  border: "1px solid #bfc7c2",
  borderRadius: 0,
  color: "#243031",
  fontSize: 12,
};
