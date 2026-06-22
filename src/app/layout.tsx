import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Goldene Rezepte – Authentische Deutsche Küche",
  description: "Traditionelle und moderne deutsche Rezepte für jeden Tag.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-H6ER0HF6WJ" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H6ER0HF6WJ');
        `}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
