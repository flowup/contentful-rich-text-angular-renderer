import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The persistent module cache serves stale library chunks from the
    // Angular test build when only non-spec files change
    fsModuleCache: false,
  },
});
