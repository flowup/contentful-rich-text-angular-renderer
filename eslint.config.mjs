import jest from '@code-pushup/eslint-config/jest';
import typescript from '@code-pushup/eslint-config/typescript';
import nxEslintPlugin from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...typescript,
  ...jest,
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.base.json', 'node_modules/rxjs/tsconfig.json'],
        },
      },
      node: {
        version: 22,
      },
    },
  },
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/fixtures/*.ts', '**/tools/**/*'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '/dist',
      '**/*.md',
      '**/*.scss',
      '**/assets',
      '**/*.ico',
      '**/*.yml',
      '**/*.yaml',
    ],
  },
);
