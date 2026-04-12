import type { Metadata } from "next";
import { Nunito, JetBrains_Mono, Exo_2 } from "next/font/google";
import "./globals.css";
import { PersonaProvider } from "@/contexts/PersonaContext";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const exo2 = Exo_2({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GPS de Carreira | Sicredi",
  description:
    "Plataforma inteligente de gestão de carreira do Sicredi. Encontre seu caminho, desenvolva suas habilidades e alcance seus objetivos profissionais.",
  keywords: ["Sicredi", "carreira", "GPS", "desenvolvimento", "cooperativismo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${jetbrainsMono.variable} ${exo2.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-neutral-800" style={{ background: '#F4F4F4' }}>
        <PersonaProvider>{children}</PersonaProvider>
      </body>
    </html>
  );
}
