/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional GitHub personal access token. Increases API rate limit during build. */
  readonly GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
