/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config & import("@trivago/prettier-plugin-sort-imports").PluginConfig}
 */
const config = {
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^@flowup/(.*)$', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};

export default config;
