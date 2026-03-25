import type { NextConfig } from "next";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const distDir = process.env.NEXT_DIST_DIR?.trim();

const remotePatterns = supabaseUrl
  ? (() => {
      const url = new URL(supabaseUrl);

      return [
        {
          protocol: url.protocol.replace(":", "") as "http" | "https",
          hostname: url.hostname,
          pathname: "/storage/v1/object/public/**",
        },
      ];
    })()
  : [];

const nextConfig: NextConfig = {
  ...(distDir ? { distDir } : {}),
  images: {
    remotePatterns,
  },
};

export default nextConfig;
