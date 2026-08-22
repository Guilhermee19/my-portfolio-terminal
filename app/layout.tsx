import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { profile, THEMES } from "@/lib/data";
import "./globals.css";

const jet = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jet",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iamgui.dev"),
  title: `${profile.handle} // TERMINAL`,
  description:
    "Portfólio de Guilherme Santana — desenvolvedor front-end com 7+ anos em Angular, React, Next.js e Three.js. Rio de Janeiro, Brasil.",
  openGraph: {
    title: "I_AM_GUI // TERMINAL",
    description:
      "Front-end engineer · 6+ anos · Angular, React, Next.js, Three.js",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#030806",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning: o script inline abaixo marca data-booted antes do React
  return (
    <html lang="pt-BR" className={jet.variable} suppressHydrationWarning>
      <head>
        {/* antes da 1ª pintura: pula o boot já visto e restaura o tema do comando `theme` */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{
              if(sessionStorage.getItem('booted'))document.documentElement.dataset.booted='1';
              var t=${JSON.stringify(THEMES)}[localStorage.getItem('theme')];
              if(t)document.documentElement.style.setProperty('--color-grn',t);
            }catch(e){}`,
          }}
        />
      </head>
      <body className="relative min-h-dvh">
        {children}
        {/* overlays do CRT — decorativos, fora do fluxo e do foco */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-90 crt-scan opacity-60 mix-blend-multiply"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-90 crt-glow"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-90 bg-grn animate-flick opacity-[0.035]"
        />
      </body>
    </html>
  );
}
