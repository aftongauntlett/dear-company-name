import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/pages/**/*.astro',
  ],
  project: [
    'src/**/*.{astro,ts}',
  ],
  // StyledDropdown is a reuse guardrail — referenced in copilot instructions
  // as the required component for any dropdown. Keep it even when unused.
  ignore: [
    'src/components/ui/StyledDropdown.astro',
  ],
};

export default config;
