"use client";

import Image from "next/image";
import Link from "next/link";
export default function Header() {
  return (
    <header className="border-b border-[#bfc7c2] bg-[#f7f8f5]">
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#607071]">
            GACHE / Greenland monitoring study
          </p>
          <nav className="flex shrink-0 items-center gap-4 text-xs font-medium">
            <Link
              href="/about-this-project"
              className="text-[#4d5959] underline decoration-[#aeb8b3] underline-offset-4 transition-colors hover:text-[#286b73] hover:decoration-[#286b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286b73] focus-visible:ring-offset-4"
            >
              About this project
            </Link>
            <a
              href="https://www.linkedin.com/in/jessicawallace2/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-[#4d5959] underline decoration-[#aeb8b3] underline-offset-4 transition-colors hover:text-[#286b73] hover:decoration-[#286b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286b73] focus-visible:ring-offset-4"
              aria-label="About Jessie Wallace on LinkedIn (opens in a new tab)"
            >
              About me
              <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
            <Link
              href="/sources"
              className="text-[#4d5959] underline decoration-[#aeb8b3] underline-offset-4 transition-colors hover:text-[#286b73] hover:decoration-[#286b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286b73] focus-visible:ring-offset-4"
            >
              Sources
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <h1 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.035em] text-[#182122] sm:text-4xl">
                Greenland Arctic Coral Health Estimator
              </h1>
              <div className="flex h-16 shrink-0 items-center gap-3" aria-label="Adventure Canada and The Explorers Club">
                <div className="relative h-14 w-16" title="Adventure Canada">
                  <Image
                    src="/logos/adventure-canada-logo-transparent.png"
                    alt="Adventure Canada"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <div className="relative h-14 w-16" title="The Explorers Club">
                  <Image
                    src="/logos/explorers-club-logo-transparent.png"
                    alt="The Explorers Club"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-4xl border-l-2 border-[#286b73] pl-4 text-sm leading-6 text-[#3f5556]">
              <strong className="font-medium">
                This work is an estimator for how these deep-sea reefs are performing
                in today&apos;s oceans. We look to estimate the health of these reefs
                without expensive deep-sea rovers, but instead using sample data &amp;
                larger ocean health data to answer the question: Can environmental
                acidification, temperature increase, and surface-level microplastic
                exposure be used as a predictor of vulnerability in Greenland
                cold-water coral ecosystems?
              </strong>
            </p>
          </div>

          <p className="max-w-xs border-l-2 border-[#286b73] pl-4 text-xs leading-5 text-[#667071]">
            Outputs support comparative analysis and should not be interpreted as
            field observations.
          </p>
        </div>

        <div className="mt-8 grid border-y border-[#cbd1cd] sm:grid-cols-3">
          <MetadataItem
            label="Microplastics in Greenland waters"
            value="142 particles/m³"
            detail="West Greenland surface-water samples, 2019"
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7746749/"
            source="Study source"
          />
          <MetadataItem
            label="Acidification in Greenland fjords"
            value="Ωarag 0.28–3.11"
            detail="West Greenland fjord observations; values below 1 are corrosive"
            href="https://pure.au.dk/ws/portalfiles/portal/417148271/1-s2.0-S0048969722060612-main.pdf"
            source="Study source"
          />
          <MetadataItem
            label="Ocean temperature near Greenland"
            value="Live satellite SST"
            detail="DMI imagery is updated several times daily"
            href="https://ocean.dmi.dk/arctic/disko.uk.php"
            source="View current SST"
          />
        </div>
      </div>
    </header>
  );
}

function MetadataItem({
  label,
  value,
  detail,
  href,
  source,
}: {
  label: string;
  value: string;
  detail: string;
  href: string;
  source: string;
}) {
  return (
    <div className="py-3 sm:border-r sm:border-[#cbd1cd] sm:px-5 sm:first:pl-0 sm:last:border-r-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#727c7b]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[#263031]">{value}</p>
      <p className="mt-1 text-xs leading-4 text-[#667071]">{detail}</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
      >
        {source} ↗
      </a>
    </div>
  );
}
