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
          // Google's CMP (AdSense Privacy & messaging) only shows its consent
          // message in the EEA, UK and CH and sends the consent update there.
          // Elsewhere no CMP runs, so a global 'denied' default would never
          // be lifted and GA4 would receive no data.
          gtag('consent', 'default', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
          });
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500,
            region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH']
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
