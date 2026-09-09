import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gache.app"),
  title: "Greenland Arctic Coral Health Estimator",
  description:
    "Research interface estimating Arctic cold-water coral health from surface ocean temperature, pH, and microplastic density.",
  icons: {
    icon: "/about/greenland-soft-coral-garden.jpg",
  },
  openGraph: {
    title: "Greenland Arctic Coral Health Estimator",
    description:
      "Research interface estimating Arctic cold-water coral health from surface ocean temperature, pH, and microplastic density.",
    url: "/",
    siteName: "GACHE",
    images: [
      {
        url: "/about/greenland-soft-coral-garden.jpg",
        width: 1800,
        height: 650,
        alt: "Cold-water corals on the Greenland seafloor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenland Arctic Coral Health Estimator",
    description:
      "Research interface estimating Arctic cold-water coral health from surface ocean temperature, pH, and microplastic density.",
    images: ["/about/greenland-soft-coral-garden.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#f2f3ef] font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
