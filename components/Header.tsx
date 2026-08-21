"use client";

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
      ? "text-[#286b73]"
      : healthScore >= 40
        ? "text-[#9a642f]"
        : "text-[#a2453d]";

  return (
    <header className="border-b border-[#bfc7c2] bg-[#f7f8f5]">
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#607071]">
            GACHE / Greenland monitoring study
          </p>
          <a
            href="https://www.linkedin.com/in/jessicawallace2/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#4d5959] underline decoration-[#aeb8b3] underline-offset-4 transition-colors hover:text-[#286b73] hover:decoration-[#286b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286b73] focus-visible:ring-offset-4"
            aria-label="About Jessie Wallace on LinkedIn (opens in a new tab)"
          >
            About me
            <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </a>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.035em] text-[#182122] sm:text-4xl">
              Greenland Arctic Coral Health Estimator
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#596465]">
              Scenario analysis for cold-water coral response using surface
              temperature, ocean pH, and microplastic density across offshore
              Greenland stations.
            </p>
          </div>

          <p className="max-w-xs border-l-2 border-[#286b73] pl-4 text-xs leading-5 text-[#667071]">
            Screening-level proxy. Outputs support comparative analysis and
            should not be interpreted as field observations.
          </p>
        </div>

        <div className="mt-8 grid border-y border-[#cbd1cd] sm:grid-cols-3">
          <MetadataItem label="Scenario classification" value={modelStatus} valueClassName={statusColor} />
          <MetadataItem label="Station dataset" value={`${pointCount} stations / ${dataSource === "csv" ? "Uploaded CSV" : "Reference sample"}`} />
          <MetadataItem label="Spatial domain" value="59–78°N / 60–10°W" />
        </div>
      </div>
    </header>
  );
}

function MetadataItem({
  label,
  value,
  valueClassName = "text-[#263031]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="py-3 sm:border-r sm:border-[#cbd1cd] sm:px-5 sm:first:pl-0 sm:last:border-r-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#727c7b]">
        {label}
      </p>
      <p className={`mt-1 text-sm font-medium ${valueClassName}`}>{value}</p>
    </div>
  );
}
