/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SRC_IMAGES:
      "",// SRC_IMAGES=[path-for-save-images-backend-frontend]
    DST_IMAGES: "/images",
    NEXT_PUBLIC_BASE_URL: "http://localhost:5000",
    NEXT_PUBLIC_FRONTEND_URL: "http://localhost:3000",
  },
};

module.exports = nextConfig;
