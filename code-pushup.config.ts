import eslintPlugin, {
  eslintConfigFromAllNxProjects,
} from '@code-pushup/eslint-plugin';
import jsPackagesPlugin from '@code-pushup/js-packages-plugin';
import type { CoreConfig } from '@code-pushup/models';
import 'dotenv/config';

const config: CoreConfig = {
  plugins: [
    await eslintPlugin(await eslintConfigFromAllNxProjects()),
    await jsPackagesPlugin({ packageManager: 'npm' }),
  ],
  categories: [
    {
      slug: 'bug-prevention',
      title: 'Bug prevention',
      refs: [{ type: 'group', plugin: 'eslint', slug: 'problems', weight: 1 }],
    },
    {
      slug: 'code-style',
      title: 'Code style',
      refs: [
        { type: 'group', plugin: 'eslint', slug: 'suggestions', weight: 1 },
      ],
    },
    {
      slug: 'security',
      title: 'Security',
      refs: [
        { type: 'group', plugin: 'js-packages', slug: 'npm-audit', weight: 1 },
      ],
    },
    {
      slug: 'updates',
      title: 'Updates',
      refs: [
        {
          type: 'group',
          plugin: 'js-packages',
          slug: 'npm-outdated',
          weight: 1,
        },
      ],
    },
  ],
  ...(process.env.CP_API_KEY && {
    upload: {
      server: 'https://api.staging.code-pushup.dev/graphql',
      apiKey: process.env.CP_API_KEY,
      organization: 'flowup',
      project: 'contentful-rich-text-angular-renderer',
    },
  }),
};

export default config;
