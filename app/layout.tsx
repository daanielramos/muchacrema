import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const grotesk = Geist({ variable: "--font-grotesk", subsets: ["latin"], display: "swap" });
const editorial = Cormorant_Garamond({ variable: "--font-editorial", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://muchacrema.mx"),
  title: "MUCHA CREMA — Branding · Web · Research",
  description: "Para marcas que se niegan a verse genéricas. Branding, experiencias web y research desde Ciudad de México.",
  keywords: ["branding", "diseño web", "research", "dirección de arte", "Ciudad de México"],
  alternates: { canonical: "/" },
  openGraph: { title: "MUCHA CREMA — Exceso controlado", description: "Branding, web y research para marcas que se niegan a verse genéricas.", type: "website", locale: "es_MX", siteName: "MUCHA CREMA", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "MUCHA CREMA — Para marcas que se niegan a verse genéricas" }] },
  twitter: { card: "summary_large_image", title: "MUCHA CREMA — Exceso controlado", description: "Para marcas que se niegan a verse genéricas.", images: ["/og.png"] },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

const schema = { "@context": "https://schema.org", "@type": "ProfessionalService", name: "MUCHA CREMA", description: "Estudio creativo de branding, web y research.", areaServed: "MX", address: { "@type": "PostalAddress", addressLocality: "Ciudad de México", addressCountry: "MX" }, url: "https://muchacrema.mx" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${grotesk.variable} ${editorial.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}</body></html>;
}
