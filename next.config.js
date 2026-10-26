/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  compress: true,
  // No CSP or frame restrictions: AdSense and Google's consent message inject
  // scripts and iframes that a strict policy would break.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Duplicate recipe, unpublished in favour of the newer version.
      {
        source: "/rezepte/dieses-erdbeer-raffaello-tiramisu-macht-suechtig-cremig-fruchtig-einfach-himmlisch",
        destination: "/rezepte/erdbeer-raffaello-tiramisu-cremiges-sommerdessert-mit-kokos-und-frischen-erdbeeren",
        permanent: true,
      },
      // Same recipe as the Hackfleisch-Pizzarolle, merged into it.
      {
        source: "/rezepte/hackfleisch-roellchen-aus-dem-ofen-knusprig-saftig-schnell-gemacht",
        destination: "/rezepte/hackfleisch-pizzarolle-aus-dem-ofen",
        permanent: true,
      },
      {
        source: "/rezepte/ein-blech-und-alle-sind-gluecklich-das-beste-hackfleisch-rezept-ever",
        destination: "/rezepte/hackfleisch-pizzarolle-aus-dem-ofen",
        permanent: true,
      },
      // Slug belonged to a different recipe; the page is the ice-cream sandwiches.
      {
        source: "/rezepte/zitronen-baiser-cannoli",
        destination: "/rezepte/erdbeer-kaesekuchen-eiscreme-sandwiches",
        permanent: true,
      },
      // Slug was accidentally generated from the "Zutaten" heading.
      {
        source: "/rezepte/zutaten",
        destination: "/rezepte/fluffige-dinner-rolls-weiche-broetchen-aus-hefeteig",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
