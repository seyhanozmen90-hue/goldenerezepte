/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  compress: true,
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
