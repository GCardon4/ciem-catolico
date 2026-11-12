import type { NextConfig } from "next";

// hostSupabase: dominio del proyecto Supabase para permitir sus imágenes en next/image
const hostSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: hostSupabase
      ? [{ protocol: "https", hostname: hostSupabase, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
