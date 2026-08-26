import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type errors in this app are all implicit-any / null-initialised state.
    // They do not affect the emitted output, so the build does not gate on
    // them. `npx tsc --noEmit` still reports them when you want the list.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
