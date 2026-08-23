export type OceanParams = {
  temp: number;
  ph: number;
  microplastics: number;
};

export type StressLevel = "Low" | "Moderate" | "Critical";

export type CoralMetrics = {
  healthScore: number;
  omegaArag: number;
  extensionRate: number;
  stressLevel: StressLevel;
};

export type OceanDataPoint = {
  id: string;
  lat: number;
  lon: number;
  temp: number;
  ph: number;
  microplastics: number;
};

export type ChartParam = "temp" | "ph" | "microplastics";

export const DEFAULT_PARAMS: OceanParams = {
  temp: 4.0,
  ph: 8.0,
  microplastics: 25,
};

/** Ideal Arctic cold-water coral baseline (minimal stress). */
export const BASELINE_PARAMS: OceanParams = {
  temp: 3.0,
  ph: 8.1,
  microplastics: 0,
};

export const CHART_PARAM_LABELS: Record<ChartParam, string> = {
  temp: "Surface Water Temp (°C)",
  ph: "Ocean pH",
  microplastics: "Microplastic Density (particles/m³)",
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type HealthStress = {
  deepTemp: number;
  thermal: number;
  acidification: number;
  microplastics: number;
  interaction: number;
  cumulativeRisk: number;
};

/**
 * Calibrated, nonlinear multi-stressor scenario model for D. pertusum health.
 *
 * The model follows the structure of coral-health prediction work that uses
 * thresholded environmental exposures and logistic responses, but its weights
 * are not fitted to Greenland field-health observations. It is therefore an
 * exploratory scenario index, not a validated ecological forecast.
 */
export function calculateHealthStress(params: OceanParams): HealthStress {
  const deepTemp = estimateDeepSeaTempFromSurface(params.temp);
  const thermal = clamp((deepTemp - 4.45) / 0.55, 0, 1);
  const acidification = clamp((8.1 - params.ph) / 0.15, 0, 1.5);
  const microplastics = clamp(
    Math.log1p(Math.max(0, params.microplastics)) / Math.log1p(500),
    0,
    1
  );
  const interaction =
    1.4 * acidification * microplastics +
    0.85 * thermal * microplastics +
    0.65 * thermal * acidification;
  const cumulativeRisk =
    thermal + 1.2 * acidification + 2.4 * microplastics + interaction;

  return {
    deepTemp,
    thermal,
    acidification,
    microplastics,
    interaction,
    cumulativeRisk,
  };
}

export function calculateHealthScore(params: OceanParams): number {
  const { cumulativeRisk } = calculateHealthStress(params);
  const logistic = (value: number) => 1 / (1 + Math.exp(-value));
  const baselineResponse = logistic(2.9);
  return clamp((100 * logistic(2.9 - cumulativeRisk)) / baselineResponse, 0, 100);
}

/** Aragonite saturation state Ω_arag estimation from pH. */
export function calculateOmegaArag(ph: number): number {
  return 1.0 + (ph - 7.8) * 2.5;
}

/** Linear calcification extension rate (mm/yr) from Ω_arag. */
export function calculateExtensionRate(omegaArag: number): number {
  return Math.max(0, 2.2 * (omegaArag - 0.8));
}

export function getStressLevel(healthScore: number): StressLevel {
  if (healthScore >= 70) return "Low";
  if (healthScore >= 40) return "Moderate";
  return "Critical";
}

export function calculateMetrics(params: OceanParams): CoralMetrics {
  const healthScore = calculateHealthScore(params);
  const omegaArag = calculateOmegaArag(params.ph);
  const extensionRate = calculateExtensionRate(omegaArag);
  const stressLevel = getStressLevel(healthScore);
  return { healthScore, omegaArag, extensionRate, stressLevel };
}

export function getParamValue(
  point: OceanParams,
  param: ChartParam
): number {
  return point[param];
}

/** Simple ordinary least-squares linear regression (y = slope * x + intercept). */
export function linearRegression(
  points: { x: number; y: number }[]
): { slope: number; intercept: number } | null {
  if (points.length < 2) return null;

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-12) return null;

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function buildScatterSeries(
  data: OceanDataPoint[],
  param: ChartParam
): { x: number; y: number; lat: number; lon: number }[] {
  return data.map((point) => ({
    x: getParamValue(point, param),
    y: calculateHealthScore(point),
    lat: point.lat,
    lon: point.lon,
  }));
}

export function buildRegressionLine(
  scatter: { x: number; y: number }[]
): { x: number; y: number }[] {
  const fit = linearRegression(scatter);
  if (!fit || scatter.length === 0) return [];

  const xs = scatter.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  return [
    { x: minX, y: clamp(fit.slope * minX + fit.intercept, 0, 100) },
    { x: maxX, y: clamp(fit.slope * maxX + fit.intercept, 0, 100) },
  ];
}

export function buildComparisonBars(current: OceanParams) {
  const baseline = calculateMetrics(BASELINE_PARAMS);
  const live = calculateMetrics(current);

  return [
    {
      metric: "Health Score",
      baseline: Number(baseline.healthScore.toFixed(1)),
      current: Number(live.healthScore.toFixed(1)),
    },
    {
      metric: "Ω_arag",
      baseline: Number(baseline.omegaArag.toFixed(2)),
      current: Number(live.omegaArag.toFixed(2)),
    },
    {
      metric: "Extension (mm/yr)",
      baseline: Number(baseline.extensionRate.toFixed(2)),
      current: Number(live.extensionRate.toFixed(2)),
    },
  ];
}

export type DriverTimelinePoint = {
  year: number;
  observedDriver: number | null;
  projectedDriver: number | null;
  observedHealth: number | null;
  projectedHealth: number | null;
  deepTemp?: number;
};

/**
 * A depth-transfer proxy for the 886–932 m Greenland Lophelia reef reported
 * at 4.1–5.0 °C. Surface anomalies are damped at depth; this is a scenario
 * model, not a replacement for temperature observations from the reef.
 */
export function estimateDeepSeaTempFromSurface(surfaceTemp: number): number {
  return clamp(4.45 + 0.12 * (surfaceTemp - 6), 4.1, 5.0);
}

const WEST_GREENLAND_OISST_JULY_SNAPSHOTS = [
  { year: 2020, temp: 8.12 },
  { year: 2021, temp: 7.82 },
  { year: 2022, temp: 5.12 },
  { year: 2023, temp: 8.27 },
  { year: 2024, temp: 4.28 },
  { year: 2025, temp: 4.63 },
] as const;

const PH_AT_1981 = 8.14;
const GREENLAND_SEA_PH_DECLINE_PER_YEAR = 0.00219;

function pHForYear(year: number): number {
  return PH_AT_1981 - GREENLAND_SEA_PH_DECLINE_PER_YEAR * (year - 1981);
}

function microplasticsForYear(year: number): number {
  if (year <= 2005) return 0.9;
  if (year <= 2014) return 0.9 + ((16.2 - 0.9) * (year - 2005)) / 9;
  if (year <= 2019) return 16.2 + ((142 - 16.2) * (year - 2014)) / 5;
  return 142 * 1.06 ** (year - 2019);
}

function surfaceTempForYear(year: number): number {
  const observed = WEST_GREENLAND_OISST_JULY_SNAPSHOTS.find(
    (point) => point.year === year
  );
  if (observed) return observed.temp;
  if (year > 2025) return 4.63 + 0.03 * (year - 2025);

  // No site-matched OISST snapshot is used before 2020 in this MVP.
  // A 6 °C neutral surface reference maps to the 4.45 °C deep-reef midpoint.
  return 6;
}

function combinedTimelineHealth(year: number, surfaceTemp = surfaceTempForYear(year)) {
  return calculateHealthScore({
    temp: surfaceTemp,
    ph: pHForYear(year),
    microplastics: microplasticsForYear(year),
  });
}

/**
 * NOAA OISST 1/4° grid-cell snapshots at 61.125°N, 51.125°W on 30/31 July.
 * Future values extend NOAA Arctic Report Card's ~0.03 °C/year ice-free Arctic
 * August warming rate as an illustrative, linear scenario.
 */
export function buildTemperatureTimeline(): DriverTimelinePoint[] {
  const observed = WEST_GREENLAND_OISST_JULY_SNAPSHOTS.map(({ year, temp }) => {
    const deepTemp = estimateDeepSeaTempFromSurface(temp);
    return {
      year,
      observedDriver: temp,
      projectedDriver: null,
      observedHealth: combinedTimelineHealth(year, temp),
      projectedHealth: null,
      deepTemp,
    };
  });

  const lastObserved = WEST_GREENLAND_OISST_JULY_SNAPSHOTS.at(-1)!;
  const projected = Array.from({ length: 10 }, (_, index) => {
    const year = 2026 + index;
    const temp = lastObserved.temp + 0.03 * (year - lastObserved.year);
    const deepTemp = estimateDeepSeaTempFromSurface(temp);
    return {
      year,
      observedDriver: null,
      projectedDriver: Number(temp.toFixed(2)),
      observedHealth: null,
      projectedHealth: combinedTimelineHealth(year, temp),
      deepTemp,
    };
  });

  return [...observed, ...projected];
}

const GREENLAND_MICROPLASTIC_OBSERVATIONS = [
  { year: 2005, particles: 0.9 },
  { year: 2014, particles: 16.2 },
  { year: 2019, particles: 142 },
] as const;

/**
 * Historical values come from Greenland Sea and West Greenland studies. The
 * reported size fractions and collection methods differ, so they are exposed
 * as sparse observations rather than a statistically comparable trend.
 */
export function buildMicroplasticTimeline(): DriverTimelinePoint[] {
  const observed = GREENLAND_MICROPLASTIC_OBSERVATIONS.map(({ year, particles }) => ({
    year,
    observedDriver: particles,
    projectedDriver: null,
    observedHealth: combinedTimelineHealth(year),
    projectedHealth: null,
  }));

  const projected = Array.from({ length: 10 }, (_, index) => {
    const year = 2026 + index;
    const particles = 142 * 1.06 ** (year - 2019);
    return {
      year,
      observedDriver: null,
      projectedDriver: Number(particles.toFixed(1)),
      observedHealth: null,
    projectedHealth: combinedTimelineHealth(year),
    };
  });

  return [...observed, ...projected];
}

/**
 * Greenland Sea upper-200 m pH trend from 1981–2019: −0.00219 pH/year.
 * Values are a trend reconstruction for visualisation; 2020 onward is an
 * explicit continuation scenario, not a future observation or climate model.
 */
export function buildAcidificationTimeline(): DriverTimelinePoint[] {
  const observedYears = [1981, 1990, 2000, 2010, 2019];
  const projectedYears = [2020, 2025, 2030, 2035];

  return [
    ...observedYears.map((year) => {
      const ph = pHForYear(year);
      return {
        year,
        observedDriver: Number(ph.toFixed(3)),
        projectedDriver: null,
        observedHealth: combinedTimelineHealth(year),
        projectedHealth: null,
      };
    }),
    ...projectedYears.map((year) => {
      const ph = pHForYear(year);
      return {
        year,
        observedDriver: null,
        projectedDriver: Number(ph.toFixed(3)),
        observedHealth: null,
        projectedHealth: combinedTimelineHealth(year),
      };
    }),
  ];
}

export function buildReefContextComparison(current: OceanParams) {
  return [
    {
      metric: "Arctic CWC health index",
      value: Number(calculateHealthScore(current).toFixed(1)),
      fill: "#286b73",
    },
    {
      metric: "Global tropical live coral cover (2019)",
      value: 29.5,
      fill: "#b36f43",
    },
  ];
}

/** 20 mock offshore Greenland stations (59–78°N, 60–10°W). */
export const MOCK_GREENLAND_DATA: OceanDataPoint[] = [
  { id: "GL-01", lat: 59.4, lon: -44.2, temp: 5.1, ph: 8.05, microplastics: 42 },
  { id: "GL-02", lat: 60.8, lon: -48.6, temp: 4.6, ph: 8.02, microplastics: 38 },
  { id: "GL-03", lat: 61.5, lon: -52.1, temp: 3.8, ph: 8.08, microplastics: 22 },
  { id: "GL-04", lat: 62.9, lon: -41.3, temp: 4.2, ph: 7.98, microplastics: 55 },
  { id: "GL-05", lat: 63.7, lon: -55.4, temp: 3.2, ph: 8.12, microplastics: 12 },
  { id: "GL-06", lat: 64.2, lon: -38.9, temp: 4.9, ph: 7.95, microplastics: 67 },
  { id: "GL-07", lat: 65.1, lon: -50.0, temp: 3.5, ph: 8.06, microplastics: 28 },
  { id: "GL-08", lat: 66.0, lon: -33.5, temp: 5.4, ph: 7.92, microplastics: 81 },
  { id: "GL-09", lat: 66.8, lon: -57.2, temp: 2.9, ph: 8.14, microplastics: 9 },
  { id: "GL-10", lat: 67.5, lon: -45.8, temp: 3.7, ph: 8.01, microplastics: 34 },
  { id: "GL-11", lat: 68.3, lon: -28.4, temp: 4.4, ph: 7.97, microplastics: 49 },
  { id: "GL-12", lat: 69.1, lon: -53.6, temp: 2.6, ph: 8.16, microplastics: 15 },
  { id: "GL-13", lat: 70.2, lon: -21.7, temp: 3.9, ph: 8.00, microplastics: 31 },
  { id: "GL-14", lat: 71.0, lon: -59.1, temp: 2.1, ph: 8.18, microplastics: 6 },
  { id: "GL-15", lat: 72.4, lon: -40.5, temp: 3.0, ph: 8.09, microplastics: 18 },
  { id: "GL-16", lat: 73.6, lon: -18.2, temp: 3.4, ph: 8.04, microplastics: 27 },
  { id: "GL-17", lat: 74.8, lon: -47.3, temp: 1.8, ph: 8.15, microplastics: 11 },
  { id: "GL-18", lat: 75.9, lon: -15.6, temp: 2.7, ph: 8.07, microplastics: 20 },
  { id: "GL-19", lat: 76.7, lon: -35.0, temp: 1.5, ph: 8.17, microplastics: 8 },
  { id: "GL-20", lat: 77.8, lon: -12.4, temp: 2.3, ph: 8.11, microplastics: 14 },
];

/**
 * Parse CSV text with required columns: lat, lon, temp, ph, microplastics.
 * Header matching is case-insensitive; extra columns are ignored.
 */
export function parseOceanCsv(csvText: string): OceanDataPoint[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.");
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const required = ["lat", "lon", "temp", "ph", "microplastics"] as const;

  const indices: Record<(typeof required)[number], number> = {
    lat: -1,
    lon: -1,
    temp: -1,
    ph: -1,
    microplastics: -1,
  };

  for (const key of required) {
    const idx = headers.indexOf(key);
    if (idx === -1) {
      throw new Error(`Missing required CSV column: ${key}`);
    }
    indices[key] = idx;
  }

  const points: OceanDataPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const lat = Number(cols[indices.lat]);
    const lon = Number(cols[indices.lon]);
    const temp = Number(cols[indices.temp]);
    const ph = Number(cols[indices.ph]);
    const microplastics = Number(cols[indices.microplastics]);

    if ([lat, lon, temp, ph, microplastics].some((v) => Number.isNaN(v))) {
      throw new Error(`Invalid numeric value on CSV row ${i + 1}.`);
    }

    points.push({
      id: `CSV-${String(i).padStart(2, "0")}`,
      lat,
      lon,
      temp,
      ph,
      microplastics,
    });
  }

  return points;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result;
}
