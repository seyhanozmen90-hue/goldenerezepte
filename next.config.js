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
    ];
  },
};

module.exports = nextConfig;
