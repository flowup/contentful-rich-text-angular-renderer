# contentful-rich-text-angular-renderer

This repository hosts the `@flowup/contentful-rich-text-angular-renderer` library ([see README](./libs/contentful-rich-text-angular-renderer/README.md)).

## Publish flow

1. Update dependencies
2. Check if demo app works correctly.
3. Open `libs/contentful-rich-text-angular-renderer/package.json`
   - Bump `version` of lib.
   - Check all peer deps are correct
4. Build lib with `nx run contentful-rich-text-angular-renderer:build:production`.
5. Change working directory to newly generated dist `cd dist/libs/contentful-rich-text-angular-renderer`
6. Check if all changes were correctly reflected.
   - Versions of (peer) dependencies.
   - Correct `version` of lib.
7. Publish with `npm publish`
