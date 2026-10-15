# @flowup/contentful-rich-text-angular-renderer

[![npm](https://img.shields.io/npm/v/@flowup/contentful-rich-text-angular-renderer)](https://www.npmjs.com/package/@flowup/contentful-rich-text-angular-renderer)
[![license](https://img.shields.io/npm/l/@flowup/contentful-rich-text-angular-renderer)](https://www.npmjs.com/package/@flowup/contentful-rich-text-angular-renderer)

**Render Contentful rich text fields in Angular and customize any node or mark with plain Angular templates.**

[Live demo](https://cf-rich-text-ng-demo.web.app/) · [Demo source](https://github.com/flowup/contentful-rich-text-angular-renderer/tree/main/apps/demo/src/app)

![The same rich text document rendered with the default templates (left) and with custom templates (right)](https://raw.githubusercontent.com/flowup/contentful-rich-text-angular-renderer/main/docs/images/default-vs-custom.png)

_The same document rendered with the built-in templates (left) and with a few custom templates (right): highlighted code, lettered lists, an image with a caption, and an embedded blog-post entry rendered as a card._

## Why

Contentful returns [rich text](https://www.contentful.com/developers/docs/concepts/rich-text/) as a JSON tree, not HTML. Contentful's official renderers produce [HTML strings](https://www.npmjs.com/package/@contentful/rich-text-html-renderer) or [React elements](https://www.npmjs.com/package/@contentful/rich-text-react-renderer). This library is the Angular equivalent:

- **Works out of the box.** Every common node and mark has a sensible default template.
- **Override only what you need** with `*cfRichTextNode` and `*cfRichTextMark` templates. Inside them you can use any Angular component, directive, pipe or router link.
- **Works with both APIs.** Pass a REST (Delivery/Preview API) `Document`, or a GraphQL `{ json, links }` fragment and linked entries and assets are resolved for you.
- **Modern Angular.** Standalone, signal-based, `OnPush` and zoneless-friendly.

## Installation

```sh
npm install @flowup/contentful-rich-text-angular-renderer @contentful/rich-text-types fast-deep-equal
```

| Library | Angular |
| ------- | ------- |
| 0.12.x  | 22      |
| 0.11.x  | 21      |
| 0.10.x  | 20      |
| 0.9.x   | 19      |
| 0.8.x   | 18      |
| 0.7.x   | 17      |

## Quick start

Import `CfRichTextDocumentComponent` and put the `cfRichTextDocument` attribute on any element:

```ts
import { Component, input } from '@angular/core';
import { Document } from '@contentful/rich-text-types';
import { CfRichTextDocumentComponent } from '@flowup/contentful-rich-text-angular-renderer';

@Component({
  selector: 'app-article-body',
  imports: [CfRichTextDocumentComponent],
  template: `<article [cfRichTextDocument]="body()"></article>`,
})
export class ArticleBodyComponent {
  readonly body = input.required<Document>();
}
```

The input accepts:

- a `Document` from `@contentful/rich-text-types`, which is the rich text field as returned by the [Delivery/Preview API](https://www.contentful.com/developers/docs/references/content-delivery-api/) (for example via the [`contentful`](https://www.npmjs.com/package/contentful) SDK),
- a GraphQL rich text fragment with `json` and `links` fields. Entries and assets from `links` are [merged into the matching nodes](https://www.contentful.com/developers/docs/concepts/rich-text/#rendering-the-rich-text-response-from-the-graphql-api-with-linked-assets-and-entries-on-the-front-end) before rendering, so your templates can read `node.data.target` the same way for both APIs,
- `null` or `undefined`, which keeps the last rendered document (handy while data is loading).

The document only re-renders when its content actually changes (deep equality), so passing a new object with the same content does nothing.

## Customizing rendering

Place templates **inside** the `cfRichTextDocument` element. Each one replaces the default template for one node or mark type, in that document only. Other documents on the page keep their own templates. Templates can be added or removed at any time (for example inside `@if`); when one is removed, the template it replaced is used again.

```ts
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import { CfRichTextChildrenDirective, CfRichTextDocumentComponent, CfRichTextMarkDirective, CfRichTextNodeDirective } from '@flowup/contentful-rich-text-angular-renderer';
import { BlogPostCardComponent } from './blog-post-card.component';

@Component({
  selector: 'app-article-body',
  imports: [CfRichTextDocumentComponent, CfRichTextNodeDirective, CfRichTextMarkDirective, CfRichTextChildrenDirective, RouterLink, BlogPostCardComponent],
  templateUrl: './article-body.component.html',
})
export class ArticleBodyComponent {
  readonly body = input.required<Document>();

  readonly BLOCKS = BLOCKS;
  readonly INLINES = INLINES;
  readonly MARKS = MARKS;
}
```

```html
<article [cfRichTextDocument]="body()">
  <!-- Open external links in a new tab -->
  <a *cfRichTextNode="INLINES.HYPERLINK; let node = node" [href]="node.data.uri" target="_blank" rel="noopener noreferrer">
    <ng-container [cfRichTextChildren]="node" />
  </a>

  <!-- Render embedded entries with your own components -->
  <ng-container *cfRichTextNode="BLOCKS.EMBEDDED_ENTRY; let node = node">
    @switch (node.data.target.sys.contentType.sys.id) { @case ('blogPost') {
    <a [routerLink]="['/blog', node.data.target.fields.slug]">
      <app-blog-post-card [entry]="node.data.target" />
    </a>
    } }
  </ng-container>

  <!-- Wrap images in a figure with a caption -->
  <figure *cfRichTextNode="BLOCKS.EMBEDDED_ASSET; let node = node">
    <img [src]="node.data.target.fields.file.url" [alt]="node.data.target.fields.description" />
    <figcaption>{{ node.data.target.fields.title }}</figcaption>
  </figure>

  <!-- Style a mark -->
  <mark *cfRichTextMark="MARKS.BOLD; let node = node">
    <ng-container [cfRichTextChildren]="node" />
  </mark>
</article>
```

### `*cfRichTextNode`

Registers a template for a node type (`BLOCKS.*` or `INLINES.*`). The template context exposes the Contentful node as `node`, so you can read `node.data` (for example `node.data.uri` or `node.data.target`) and `node.content`.

### `*cfRichTextMark`

Registers a template for a mark type (`MARKS.*`). Here `node` is the text node. When text has several marks, they are rendered from the outside in, in the order Contentful lists them. Inside a mark template, `[cfRichTextChildren]="node"` renders the text with its remaining marks. You can also output `{{ node.value }}` directly if you want to handle the raw text yourself, for example to syntax-highlight code.

### `[cfRichTextChildren]`

Renders the children of a node through the active templates, which is how nesting works. Put it wherever the node's content should appear. Leave it out if your template renders the node in its own way (embedded entries and assets usually have no children).

### Default templates

You get these without writing any templates:

| Type                                                          | Rendered as                                                                               |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `paragraph`, `heading-1` … `heading-6`                        | `<p>`, `<h1>` … `<h6>`                                                                    |
| `unordered-list`, `ordered-list`                              | `<ul>`, `<ol>` with `<li>` items                                                          |
| `blockquote`, `hr`                                            | `<blockquote>`, `<hr>`                                                                    |
| `hyperlink`                                                   | `<a [href]="node.data.uri">` (unsafe URLs are sanitized)                                  |
| `embedded-asset-block`                                        | 266×300 `<img>` with `NgOptimizedImage` for REST or GraphQL assets, nothing if unresolved |
| `embedded-entry-block`                                        | an empty `<div>`, meant to be overridden                                                  |
| `embedded-entry-inline`, `entry-hyperlink`, `asset-hyperlink` | a `<span>` placeholder showing the type and ID, meant to be overridden                    |
| `bold`, `italic`, `underline`, `code`                         | `<b>`, `<i>`, `<u>`, `<code>`                                                             |
| `superscript`, `subscript`, `strikethrough`                   | `<sup>`, `<sub>`, `<s>`                                                                   |

Node types without a template are skipped. That includes tables and Contentful resource links. Add a `*cfRichTextNode` template for any of these that you use. Marks without a template (for example custom marks) are skipped too, but their text is still rendered with its other marks.

### Default templates in your own markup

Add `isDefault: true` to make a template a fallback: it's used only when no other template for that type exists. This is how the built-in templates are registered:

```html
<p *cfRichTextNode="BLOCKS.PARAGRAPH; isDefault: true; let node = node">
  <ng-container [cfRichTextChildren]="node" />
</p>
```

## GraphQL

Query the rich text field with its `json` and `links`, and pass the whole field object to `cfRichTextDocument`:

```graphql
query Article($id: String!) {
  article(id: $id) {
    body {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on BlogPost {
              title
              slug
            }
          }
          inline {
            sys {
              id
            }
          }
          hyperlink {
            sys {
              id
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            title
            description
          }
        }
      }
    }
  }
}
```

```html
<article [cfRichTextDocument]="article.body"></article>
```

Linked entries and assets are merged into `node.data.target`. With GraphQL, assets have `url`, `title` and `description` at the top level rather than under `fields`. The default `embedded-asset-block` template handles both shapes. Your own templates read whichever shape your API returns, for example:

```html
<img *cfRichTextNode="BLOCKS.EMBEDDED_ASSET; let node = node" [src]="node.data.target.url" [alt]="node.data.target.description" />
```

## API

| Export                         | Kind      | Purpose                                                              |
| ------------------------------ | --------- | -------------------------------------------------------------------- |
| `CfRichTextDocumentComponent`  | Component | `[cfRichTextDocument]` renders a document with the default templates |
| `CfRichTextNodeDirective`      | Directive | `*cfRichTextNode` registers a template for a node type               |
| `CfRichTextMarkDirective`      | Directive | `*cfRichTextMark` registers a template for a mark type               |
| `CfRichTextChildrenDirective`  | Directive | `[cfRichTextChildren]` renders a node's children                     |
| `RichTextFieldFragmentGQL`     | Type      | Shape of a GraphQL rich text field (`json` + `links`)                |
| `CommonNode`, `CommonNodeType` | Types     | Any rich text node, and its `nodeType`                               |
| `NodeContext`                  | Type      | Template context (`{ node }`)                                        |

## Contributing

The repository is an Nx workspace with the library in `libs/contentful-rich-text-angular-renderer` and a demo app in `apps/demo`.

```sh
npm install
npx nx serve demo                                       # demo at http://localhost:4200
npx nx test contentful-rich-text-angular-renderer       # unit tests (Vitest)
npx nx run-many -t build lint test
```

## License

MIT
