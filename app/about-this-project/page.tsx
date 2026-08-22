import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About this project | Greenland Arctic Coral Health Estimator",
  description:
    "Background and intended use for the Greenland Arctic Coral Health Estimator.",
};

export default function AboutThisProjectPage() {
  return (
    <main className="min-h-screen bg-[#f2f3ef] px-5 py-7 text-[#182122] sm:px-8 sm:py-10">
      <article className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-5 border-b border-[#bfc7c2] pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#607071]">
              GACHE / Project background
            </p>
            <h1 className="mt-4 text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl">
              About this project
            </h1>
          </div>
          <Link
            href="/"
            className="shrink-0 text-xs font-medium text-[#4d5959] underline decoration-[#aeb8b3] underline-offset-4 transition-colors hover:text-[#286b73] hover:decoration-[#286b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286b73] focus-visible:ring-offset-4"
          >
            Back to estimator
          </Link>
        </div>

        <figure className="mt-8">
          <Image
            src="/greenland-ocean.jpg"
            alt="Iceberg floating in cold Arctic waters off Greenland"
            width={1600}
            height={2400}
            priority
            className="h-72 w-full object-cover object-center sm:h-96"
          />
          <figcaption className="mt-2 font-mono text-[10px] text-[#6e7876]">
            Arctic waters, Greenland. Photograph sourced from Unsplash.
          </figcaption>
        </figure>

        <div className="mt-10 max-w-2xl space-y-5 text-sm leading-7 text-[#4f5c5c]">
          <p>
            The Greenland Arctic Coral Health Estimator (GACHE) is a small,
            exploratory interface for considering how surface ocean conditions
            may relate to cold-water coral health. It brings temperature,
            seawater pH, and microplastic density into one transparent scenario
            view for offshore Greenland stations.
          </p>
          <p>
            GACHE is designed for comparison and learning: adjust the inputs,
            inspect the resulting health index, and compare the scenario against
            an idealized Arctic baseline. The station dataset is a reference
            sample and can be replaced with a CSV containing local observations.
          </p>
          <p>
            This is a screening-level proxy, not a field assessment or a
            validated ecological forecast. Its outputs should be used to frame
            questions, communicate environmental pressure, and guide more
            rigorous observation and modelling work.
          </p>
        </div>
      </article>
    </main>
  );
}
