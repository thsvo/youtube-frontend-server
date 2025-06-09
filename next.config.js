const nextConfig = {
  images: {
    // Allow images from localhost and a specific backend domain
    domains: ["wordpress.codeopx.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: process.env.BACKEND_DOMAIN,
        pathname: "/images/**",
      },
    ],
  },
  // Enable static exports for hosting on any platform
  output: "standalone",
}

module.exports = nextConfig

