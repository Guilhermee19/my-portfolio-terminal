import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // há outros lockfiles em C:\GuiDev — fixa a raiz neste projeto
  turbopack: { root: import.meta.dirname },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
