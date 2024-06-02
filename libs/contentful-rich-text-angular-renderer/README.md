# @flowup/contentful-rich-text-angular-renderer

**An Angular library for template-driven custom rendering of Contentful rich text fields.**

Check out the [live demo](https://cf-rich-text-ng-demo.web.app/).

## Motivation

From the [Contentful docs](https://www.contentful.com/developers/docs/concepts/rich-text/):

> Rich Text is a field type that enables authors to create rich text content, similar to traditional "What you see is what you get" (wysiwyg) editors. The key difference here is that the Contentful Rich Text field response is returned as pure JSON rather than HTML. It offers common text formatting options such as paragraphs, lists and blockquotes, and allows entries and assets within our Contentful space to be linked dynamically and embedded within the flow of the text.

Contentful provides [official SDKs for custom rich text rendering](https://www.contentful.com/developers/docs/javascript/tutorials/rendering-contentful-rich-text-with-javascript/), but only for [pure HTML strings](https://www.npmjs.com/package/@contentful/rich-text-html-renderer) and for [React components](https://www.npmjs.com/package/@contentful/rich-text-react-renderer). This library provides the same functionality for Angular apps, giving developers the freedom to customize how individual rich text nodes/marks are rendered using Angular templates.

## Setup

Assuming you already have an Angular project, simply install this package from NPM, along with its peer dependencies:

```sh
npm install @flowup/contentful-rich-text-angular-renderer @contentful/rich-text-types fast-deep-equal
```

## Usage

To simply render a rich text document using the default configuration:

```html
<div [cfRichTextDocument]="document"></div>
```

The input object is expected to match the `Document` type from `@contentful/rich-text-types` (\*). This is the JSON format of rich text fields, as returned by the Contentful Delivery API. Contentful entries may be fetched from the API using [the official JavaScript SDK](https://www.npmjs.com/package/contentful). (**Note**: If want you the entry fields to be strongly typed, you may use the [`@flowup/contentful-client`](https://www.npmjs.com/package/@flowup/contentful-client) and [`@flowup/contentful-types-generator`](https://www.npmjs.com/package/@flowup/contentful-types-generator) packages instead.)

(\*) If you're using the [Contentful GraphQL API](https://www.contentful.com/developers/docs/references/graphql/), then the input object should instead contain the `json` and `links` GraphQL fields (this will take care of [resolving linked entries and assets](https://www.contentful.com/developers/docs/concepts/rich-text/#rendering-the-rich-text-response-from-the-graphql-api-with-linked-assets-and-entries-on-the-front-end)).

The main feature of this library is allowing you to easily override how different types of nodes in the document tree are rendered. Using the provided structural directives, you define not just your own HTML markup, but also your own components, directives, etc.

This next example configures the following overrides:

- hyperlinks from YouTube will be rendered as an embedded YouTube player instead of a plain link,
- other hyperlinks will be opened in a new browser tab,
- embedded blog post entries will be rendered as cards using a custom Angular component, and will also function as an internal page link,
- embedded gallery entries will be rendered using a custom Angular component,
- text marked as code will be rendered as a standalone code block with syntax highlighting.

```ts
import { Component, Input } from '@angular/core';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import { highlightAuto } from 'highlight.js';

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
})
export class FooComponent {
  @Input() document: Document;

  readonly BLOCKS = BLOCKS;
  readonly MARKS = MARKS;
  readonly INLINES = INLINES;

  readonly YT_EMBED_REGEX = /^https?:\/\/(?:www\.)?youtube\.com\/embed\//;

  highlightCode(code: string): string {
    return highlightAuto(code).value;
  }
}
```

```html
<div [cfRichTextDocument]="document">
  <ng-container *cfRichTextNode="INLINES.HYPERLINK; let node = node">
    <iframe *ngIf="YT_EMBED_REGEX.test(node.data.uri); else externalLink" [src]="node.data.uri" [title]="node.content[0].value"></iframe>

    <ng-template #externalLink>
      <a [href]="node.data.uri" target="_blank" rel="noopener noreferrer">
        <ng-container [cfRichTextChildren]="node"></ng-container>
      </a>
    </ng-template>
  </ng-container>

  <ng-container *cfRichTextNode="BLOCKS.EMBEDDED_ENTRY; let node = node" [ngSwitch]="node.data.target.sys.contentType.sys.id">
    <a *ngSwitchCase="'blogPost'" [routerLink]="['/post', node.data.target.sys.id]">
      <app-blog-post-card [entry]="node.data.target"></app-blog-post-card>
    </a>

    <app-gallery [entry]="node.data.target"></app-gallery>
  </ng-container>

  <pre *cfRichTextMark="MARKS.CODE; let node = node"><code class="hljs" [innerHTML]="highlightCode(node.value)"></code></pre>
</div>
```

Check out demo app for another [example of customizing a rich text document](https://github.com/flowup/contentful-rich-text-angular-renderer/tree/main/apps/demo/src/app/components/custom-rich-text) (used in [live demo](https://cf-rich-text-ng-demo.web.app/)).
