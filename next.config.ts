import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default withMDX(nextConfig);
