"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import ControlPanel from "@/components/ControlPanel";
import MetricsGrid from "@/components/MetricsGrid";
import ChartsSection from "@/components/ChartsSection";
import {
  DEFAULT_PARAMS,
  MOCK_GREENLAND_DATA,
  calculateMetrics,
  parseOceanCsv,
  type ChartParam,
  type OceanDataPoint,
  type OceanParams,
} from "@/lib/coralModel";

export default function Home() {
  const [params, setParams] = useState<OceanParams>(DEFAULT_PARAMS);
  const [chartParam, setChartParam] = useState<ChartParam>("temp");
  const [stations, setStations] = useState<OceanDataPoint[]>(MOCK_GREENLAND_DATA);
  const [dataSource, setDataSource] = useState<"mock" | "csv">("mock");

  const metrics = useMemo(() => calculateMetrics(params), [params]);

  const handleCsvUpload = async (file: File) => {
    const text = await file.text();
    const parsed = parseOceanCsv(text);
    setStations(parsed);
    setDataSource("csv");
  };

  const handleResetData = () => {
    setStations(MOCK_GREENLAND_DATA);
    setDataSource("mock");
  };

  return (
    <div className="min-h-screen bg-[#f2f3ef] text-[#182122]">
      <Header
        pointCount={stations.length}
        dataSource={dataSource}
        healthScore={metrics.healthScore}
      />

      <main className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-10 lg:py-10">
        <ControlPanel
          params={params}
          chartParam={chartParam}
          onParamsChange={setParams}
          onChartParamChange={setChartParam}
          onCsvUpload={handleCsvUpload}
          onResetData={handleResetData}
          dataSource={dataSource}
        />

        <div className="min-w-0 space-y-8">
          <MetricsGrid metrics={metrics} />
          <ChartsSection
            data={stations}
            chartParam={chartParam}
            params={params}
          />
        </div>
      </main>
    </div>
  );
}
