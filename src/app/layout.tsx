import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Goldene Rezepte für jeden Tag",
  description: "Traditionelle und moderne deutsche Rezepte für jeden Tag.",
  other: {
    "p:domain_verify": "72810a5c8113459637fa5b5c6cb06786",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
        `}} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-H6ER0HF6WJ" />
        <script dangerouslySetInnerHTML={{ __html: `
          gtag('js', new Date());
          gtag('config', 'G-H6ER0HF6WJ');
        `}} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4966616802535023"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
