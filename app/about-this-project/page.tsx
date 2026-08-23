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
      <article className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-5 border-b border-[#bfc7c2] pb-6">
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
        </header>

        <section className="mt-8">
          <div className="relative aspect-[8/3] overflow-hidden rounded-2xl bg-[#e4e8e3]">
            <Image
              src="/about/about-project-hero.png"
              alt="Expedition vessel on Arctic waters at dusk"
              fill
              priority
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="rounded-2xl object-cover"
            />
          </div>
          <p className="mt-2 text-xs text-[#6e7876]">
            <a
              href="https://oceannovaexpeditions.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
            >
              The Ocean Nova hosts legendary expeditions to the ends of the earth ↗
            </a>
          </p>
        </section>

        <section className="mt-10 border-t border-[#cbd1cd] pt-6">
          <h2 className="text-2xl font-medium tracking-[-0.03em]">
            Greenland&apos;s cold-water coral ecosystems
          </h2>
          <div className="mt-5 max-w-4xl space-y-4 text-sm leading-7 text-[#4f5c5c]">
            <p>
              <strong className="font-medium text-[#263031]">
                Greenland does not have tropical coral reefs — but it does have
                cold-water coral ecosystems.
              </strong>{" "}
              When people say &quot;coral reefs,&quot; they often mean tropical reefs (Great
              Barrier Reef, Caribbean, etc.), which do not occur in Greenland because
              temperatures are too low and there is insufficient sunlight.
            </p>
            <p>
              However, Greenland hosts{" "}
              <strong className="font-medium text-[#263031]">cold-water coral ecosystems</strong>,
              especially reefs built by the stony coral <em>Lophelia pertusa</em>{" "}
              (now often classified as <em>Desmophyllum pertusum</em>) and coral
              gardens formed by soft corals and gorgonians.
            </p>
            <p>
              Greenland&apos;s{" "}
              <strong className="font-medium text-[#263031]">cold-water coral ecosystems</strong>{" "}
              rely on reefs built by the stony coral <em>Lophelia pertusa</em>{" "}
              (now often classified as <em>Desmophyllum pertusum</em>) and coral
              gardens formed by soft corals and gorgonians.
            </p>
            <div>
              <p>These ecosystems are important because they:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>provide habitat for fish and invertebrates,</li>
                <li>increase local biodiversity,</li>
                <li>serve as indicators of ocean change,</li>
                <li>are vulnerable to disturbance from warming, acidification, and fishing.</li>
              </ul>
            </div>
            <p>
              These ecosystems are important because they provide habitat for fish and
              invertebrates, increase local biodiversity, and serve as indicators of
              ocean change.
            </p>
          </div>
          <figure className="mt-8 max-w-4xl">
            <Image
              src="/about/greenland-soft-coral-garden.jpg"
              alt="Soft corals, anemones, and other marine life on the seafloor in Greenlandic waters"
              width={1800}
              height={650}
              sizes="(min-width: 1024px) 896px, 100vw"
              className="w-full rounded-2xl"
            />
            <figcaption className="mt-2 text-xs text-[#6e7876]">
              Image source:{" "}
              <a
                href="https://www.designboom.com/design/soft-coral-garden-discovery-greenland-06-29-2020/"
                target="_blank"
                rel="noreferrer"
                className="text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
              >
                Designboom — Scientists discover a soft coral garden in Greenland&apos;s deep sea ↗
              </a>
            </figcaption>
          </figure>
        </section>

        <section className="mt-10 grid gap-8 border-t border-[#cbd1cd] pt-6 lg:grid-cols-2">
          <div className="max-w-xl">
            <h2 className="text-2xl font-medium tracking-[-0.03em]">
              The Young Explorers Program
            </h2>
            <div className="mt-5 space-y-5 text-sm leading-7 text-[#4f5c5c]">
              <div>
                <p className="mt-1">
                  The{" "}
                  <a
                    href="https://www.explorers.org/grants/adventure-canada-young-explorers/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
                  >
                    Young Explorers Program ↗
                  </a>{" "}
                  supports young people with place-based projects in science, art,
                  and conservation. Selected explorers join an Adventure Canada
                  expedition to carry out field research or creative and cultural
                  work while building relationships within an international
                  exploration community.
                </p>
                <p className="mt-3">
                  Learn more about{" "}
                  <a
                    href="https://www.adventurecanada.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
                  >
                    Adventure Canada ↗
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.explorers.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
                  >
                    The Explorers Club ↗
                  </a>
                  . Credit to Adventure Canada and The Explorers Club for making
                  this work possible.
                </p>
              </div>
              <div>
                <p className="font-medium text-[#263031]">My proposal</p>
                <p className="mt-1">
                  This project measures micro-plastics, acidification, &amp; temperature
                  levels in surface and mid-water samples along the Western Greenland
                  expedition route above the deep sea reefs, then compares those
                  observations with the ocean conditions that shape deep-sea{" "}
                  <em>Desmophyllum pertusum</em> coral habitat. The goal is to better
                  understand whether sinking plastic pollution may increase pressure
                  on Greenland&apos;s cold-water reefs.
                </p>
                <p className="mt-3">
                  <a
                    href="https://www.adventurecanada.com/staff/jesse-wallace-young-explorer"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
                  >
                    Read Jesse Wallace&apos;s Young Explorer profile ↗
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#607071]">
              Image gallery
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <GalleryImage
                src="/about/carousel-1.jpg"
                alt="Ice formations and a snowy ridge under a clear blue sky"
                caption="Icebergs"
              />
              <GalleryImage
                src="/about/carousel-2.jpg"
                alt="A small boat approaching the rocky Greenland coast"
                caption="A Zodiac Landing"
              />
              <GalleryImage
                src="/about/collecting-water-samples.png"
                alt="Jesse Wallace collecting a water sample beside a Greenlandic fjord"
                caption="Collecting Water Samples"
              />
              <GalleryImage
                src="/about/young-explorers-2026.png"
                alt="Young Explorers on board with Greenlandic mountains and icebergs behind them"
                caption="The Young Explorers"
                aspectClass="aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 border-t border-[#cbd1cd] pt-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-medium tracking-[-0.03em]">
              About me
            </h2>
            <div className="relative mt-4 aspect-[4/5] max-w-sm overflow-hidden rounded-2xl bg-[#e4e8e3]">
              <Image
                src="/about/about-me.jpg"
                alt="Portrait of the project author in the Greenland mountains"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="rounded-2xl object-cover object-[72%_center]"
              />
            </div>
          </div>
          <div className="lg:pt-7">
            <div className="mt-4 max-w-xl space-y-5 text-sm leading-7 text-[#4f5c5c]">
              <p>
                My career as a Mechanical Engineer—designing advanced electronics
                hardware at Apple, Tesla, and Google[X]—has been driven by a desire
                to build robust systems for extreme environments. This foundation was
                laid during my robotics research at Carnegie Mellon University&apos;s
                Robomechanics Lab, where I developed legged robots designed to
                traverse and study undiscovered, rugged terrain. Outside of the lab
                and the workshop, my deepest passion is marine conservation; I spend
                my free time designing and deploying 3D-printable structures to
                protect and restore fragile coral reef ecosystems.
              </p>
              <p>
                Attending Explorers Club lectures has continually inspired me to
                merge these two worlds: cutting-edge hardware engineering and marine
                conservation. The Iceland to Greenland expedition presented the
                ultimate frontier for this synthesis - The dynamic, weather-dependent
                itinerary along the Denmark Strait and Greenlandic fjords required
                exactly the kind of agile, hyper-reliable hardware I specialize in
                building. I applied to this program because I want to prove that
                rigorous, high-fidelity marine data collection in inaccessible
                environments doesn&apos;t require a massive research vessel—it just
                requires mechanical ingenuity and a commitment to preserving our
                oceans&apos; hidden ecosystems.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 border-t border-[#cbd1cd] pt-6 pb-12">
          <h2 className="text-2xl font-medium tracking-[-0.03em]">
            View Keynotes &amp; More Work
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="/keynotes/autonomous-aquatic-debris-cleanup-robot.pdf"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
              >
                Autonomous Aquatic Debris Cleanup Robot
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">↗</span>
                <span className="font-mono text-[10px] text-[#6e7876] no-underline">PDF</span>
              </a>
            </li>
            <li className="pt-2">
              <p className="text-sm font-medium text-[#263031]">
                Microspine-Enhanced Spring Legs for Robotic Running &amp; Climbing
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>
                  <a
                    href="/keynotes/robotic-spring-legs-poster.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
                  >
                    Poster <span className="font-mono text-[10px] text-[#6e7876]">PDF</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/keynotes/microspine-enhanced-spring-legs-abstract.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#286b73] underline decoration-[#77a4a4] underline-offset-4 transition-colors hover:text-[#1a4f55]"
                  >
                    Abstract <span className="font-mono text-[10px] text-[#6e7876]">PDF</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}

function GalleryImage({
  src,
  alt,
  caption,
  aspectClass = "aspect-[3/4]",
}: {
  src: string;
  alt: string;
  caption: string;
  aspectClass?: string;
}) {
  return (
    <figure>
      <div className={`relative ${aspectClass} overflow-hidden rounded-2xl bg-[#e4e8e3]`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 640px) 15vw, 45vw"
          className="rounded-2xl object-cover"
        />
      </div>
      <figcaption className="mt-2 text-xs text-[#6e7876]">{caption}</figcaption>
    </figure>
  );
}
