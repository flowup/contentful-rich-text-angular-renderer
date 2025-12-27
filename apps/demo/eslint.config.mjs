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
    '@angular-eslint/component-selector': [
      'warn',
      {
        type: 'element',
        style: 'kebab-case',
        prefix: ['demo'],
      },
    ],
    '@angular-eslint/directive-selector': [
      'warn',
      {
        type: 'attribute',
        style: 'camelCase',
        prefix: 'demo',
      },
    ],
    '@angular-eslint/pipe-prefix': [
      'warn',
      {
        prefixes: ['demo'],
      },
    ],
  }
});
