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

/**
 * Multivariate linear-regression proxy for Arctic cold-water coral health.
 * Ideal CWC surface temperature ~3°C; acidification and microplastics reduce score.
 */
export function calculateHealthScore(params: OceanParams): number {
  const tempPenalty = 2.5 * Math.max(0, params.temp - 3.0);
  const acidificationPenalty = 20.0 * (8.1 - params.ph);
  const microplasticPenalty = 0.12 * params.microplastics;
  return clamp(
    100 - (tempPenalty + acidificationPenalty + microplasticPenalty),
    0,
    100
  );
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
    { x: minX, y: fit.slope * minX + fit.intercept },
    { x: maxX, y: fit.slope * maxX + fit.intercept },
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
