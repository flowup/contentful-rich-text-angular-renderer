import angular from '@code-pushup/eslint-config/angular';
import tseslint from 'typescript-eslint';
import baseConfig from '../../eslint.config.mjs';

export default tseslint.config(...baseConfig, ...angular, {
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    // Removed in angular-eslint v22 but still enabled by @code-pushup/eslint-config/angular.
    '@angular-eslint/no-conflicting-lifecycle': 'off',
    '@angular-eslint/component-selector': [
      'warn',
      [
        {
          type: 'element',
          style: 'kebab-case',
          prefix: ['cf'],
        },
        {
          type: 'attribute',
          style: 'camelCase',
          prefix: ['cf'],
        },
      ],
    ],
    '@angular-eslint/directive-selector': [
      'warn',
      {
        type: 'attribute',
        style: 'camelCase',
        prefix: 'cf',
      },
    ],
    '@angular-eslint/pipe-prefix': [
      'warn',
      {
        prefixes: ['cf'],
      },
    ],
  },
});
