const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // ImageKit-hosted assets (identity verification uploads, and any
        // package images migrated off Unsplash later) — hostname comes from
        // NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT, e.g. ik.imagekit.io/<id>.
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), geolocation=(), microphone=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.dev",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' https://images.unsplash.com https://ik.imagekit.io https://img.clerk.com data: blob:",
              "media-src 'self' https://assets.mixkit.co https://ik.imagekit.io blob:",
              "connect-src 'self' https://*.clerk.dev https://*.clerk.accounts.dev https://api.imagekit.io https://upload.imagekit.io",
              "frame-src 'self' https://*.clerk.accounts.dev",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
