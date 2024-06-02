module.exports = {
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: ['^@cp/(.*)$', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};
