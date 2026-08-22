import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sources | Greenland Arctic Coral Health Estimator",
  description:
    "Research, reporting, and monitoring references used by the Greenland Arctic Coral Health Estimator.",
};

const sources = [
  {
    title: "Reefs of the Deep: The Biology and Geology of Cold-Water Coral Ecosystems",
    citation: "Roberts, J. M., Wheeler, A. J., & Freiwald, A. (2006). Science, 312(5773), 543–547.",
    href: "https://www.science.org/doi/10.1126/science.1119861",
    image:
      "https://www.science.org/cms/asset/23dc6cd5-0f8a-430c-b1dd-2de4f9913f47/312_543_f1.gif",
    alt: "Illustration from the Science review of cold-water coral ecosystems",
    blurb:
      "This foundational review explains how cold-water corals create complex deep-sea habitats and why their reefs support unusually rich biodiversity. It provides essential context for understanding the ecosystems GACHE is designed to explore.",
    credit: "Image from the article",
    remote: true,
  },
  {
    title:
      "Water mass characteristics and associated fauna of a recently discovered Lophelia pertusa reef in Greenlandic waters",
    citation:
      "Meyer, H. K. et al. (2017). Polar Biology, 40, 321–337.",
    href: "https://link.springer.com/article/10.1007/s00300-016-1957-3",
    image: "/sources/greenland-lophelia-reef.jpg",
    alt: "Lophelia pertusa reef imagery from Greenlandic waters",
    blurb:
      "This study documents a living deep-water Lophelia pertusa reef off Greenland at roughly 886–932 m depth. It connects the reef and its associated fauna to stable Atlantic-influenced water masses, illustrating the specific conditions that support these ecosystems.",
    credit: "Figure from the article",
    remote: false,
  },
  {
    title: "Deepest ice reef in the world discovered – and it’s teeming with life",
    citation: "Kubny, H. (2026, January 14). Polar Journal.",
    href: "https://polarjournal.net/deepest-ice-reef-in-the-world-discovered-and-its-teeming-with-life/",
    image: "/sources/freya-mounds.webp",
    alt: "Deep-sea life photographed during the Arctic Deep Expedition",
    blurb:
      "Polar Journal reports on the Freya Mounds, a deep western Greenland gas-hydrate site where microbial communities underpin an unexpectedly diverse ecosystem. The discovery is a vivid reminder that Arctic seafloor habitats can thrive far beyond the reach of sunlight.",
    credit: "Image from Polar Journal",
    remote: false,
  },
  {
    title:
      "Here’s How Satellites Play a Pivotal Role in Monitoring the Health of Coral Reefs",
    citation: "NOAA National Environmental Satellite, Data, and Information Service.",
    href: "https://www.nesdis.noaa.gov/our-environment/oceans-coasts/heres-how-satellites-play-pivotal-role-monitoring-the-health-of-coral-reefs",
    image: "/sources/noaa-coral-monitoring.webp",
    alt: "Global view of coral reef monitoring from NOAA",
    blurb:
      "NOAA describes how satellite observations track sea-surface temperature and identify thermal stress before coral bleaching becomes visible. These large-scale measurements show how ocean data can help direct attention to vulnerable reef regions.",
    credit: "Image from NOAA NESDIS",
    remote: false,
  },
] as const;

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-[#f2f3ef] px-5 py-7 text-[#182122] sm:px-8 sm:py-10">
      <article className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-5 border-b border-[#bfc7c2] pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#607071]">
              GACHE / Research library
            </p>
            <h1 className="mt-4 text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl">
              Sources
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4f5c5c]">
              Articles and research that inform the project&apos;s cold-water coral,
              Arctic ecosystem, and ocean-monitoring context.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 text-xs font-medium text-[#4d5959] underline decoration-[#aeb8b3] underline-offset-4 transition-colors hover:text-[#286b73] hover:decoration-[#286b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286b73] focus-visible:ring-offset-4"
          >
            Back to estimator
          </Link>
        </header>

        <section className="grid gap-8 py-8 sm:py-10">
          {sources.map((source, index) => (
            <article
              key={source.href}
              className="grid overflow-hidden rounded-2xl border border-[#cbd1cd] bg-[#f8f9f6] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              <div className="relative min-h-64 bg-[#e4e8e3]">
                {source.remote ? (
                  // Science serves its figure remotely; a regular image keeps this source self-contained.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={source.image}
                    alt={source.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={source.image}
                    alt={source.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#607071]">
                  Source {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-xl font-medium leading-tight tracking-[-0.025em] text-[#263031] sm:text-2xl">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-[#aeb8b3] underline-offset-4 transition-colors hover:text-[#286b73] hover:decoration-[#286b73]"
                  >
                    {source.title} ↗
                  </a>
                </h2>
                <p className="mt-3 text-xs leading-5 text-[#667071]">{source.citation}</p>
                <p className="mt-5 text-sm leading-7 text-[#4f5c5c]">{source.blurb}</p>
                <div className="mt-6 flex items-center justify-between gap-4 text-xs">
                  <span className="text-[#6e7876]">{source.credit}</span>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
                  >
                    Read source ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </article>
    </main>
  );
}
