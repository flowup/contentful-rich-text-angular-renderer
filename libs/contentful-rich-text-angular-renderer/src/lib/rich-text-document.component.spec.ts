import { Component, signal, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Block,
  BLOCKS,
  Document,
  Inline,
  INLINES,
  MARKS,
  Text,
  TopLevelBlock,
} from '@contentful/rich-text-types';
import { CfRichTextChildrenDirective } from './rich-text-children.directive';
import { CfRichTextDocumentComponent } from './rich-text-document.component';
import { CfRichTextMarkDirective } from './rich-text-mark.directive';
import { CfRichTextNodeDirective } from './rich-text-node.directive';
import { RichTextFieldFragmentGQL } from './types';

type DocumentInput = Document | RichTextFieldFragmentGQL | null | undefined;

const text = (value: string, ...marks: string[]): Text => ({
  nodeType: 'text',
  value,
  marks: marks.map(type => ({ type })),
  data: {},
});

const block = (
  nodeType: BLOCKS,
  content: (Block | Inline | Text)[] = [],
  data: Record<string, unknown> = {},
): Block => ({ nodeType, content, data });

const inline = (
  nodeType: INLINES,
  content: Text[] = [],
  data: Record<string, unknown> = {},
): Inline => ({ nodeType, content, data });

const doc = (...content: Block[]): Document => ({
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: content as TopLevelBlock[],
});

const entryTarget = (id: string) => ({ target: { sys: { id } } });

const asset = {
  target: {
    sys: { id: 'asset-1' },
    fields: { title: 'Asset title', file: { url: '/image.png' } },
  },
};

/** Rendered markup without Angular's comment anchors and formatting whitespace */
function html(element: Element): string {
  return element.innerHTML
    .replaceAll(/<!--[\s\S]*?-->/g, '')
    .replaceAll(/\s*\n\s*/g, '')
    .trim();
}

@Component({
  imports: [CfRichTextDocumentComponent],
  template: `<div id="doc" [cfRichTextDocument]="document()"></div>`,
})
class DefaultHostComponent {
  readonly document = signal<DocumentInput>(doc());
}

@Component({
  imports: [
    CfRichTextDocumentComponent,
    CfRichTextNodeDirective,
    CfRichTextMarkDirective,
    CfRichTextChildrenDirective,
  ],
  template: `
    <div id="doc" [cfRichTextDocument]="document()">
      <section *cfRichTextNode="BLOCKS.PARAGRAPH; let node = node">
        <ng-container [cfRichTextChildren]="node" />
      </section>
      <strong *cfRichTextMark="MARKS.BOLD; let node = node">
        <ng-container [cfRichTextChildren]="node" />
      </strong>
      <pre *cfRichTextMark="MARKS.CODE; let node = node">{{ node.value }}</pre>
      <article *cfRichTextNode="BLOCKS.EMBEDDED_ENTRY; let node = node">
        {{ node.data.target.fields?.title }}
      </article>
      @if (showQuote()) {
        <aside *cfRichTextNode="BLOCKS.QUOTE; let node = node">
          <ng-container [cfRichTextChildren]="node" />
        </aside>
      }
    </div>
  `,
})
class CustomHostComponent {
  readonly BLOCKS = BLOCKS;
  readonly MARKS = MARKS;
  readonly document = signal<DocumentInput>(doc());
  readonly showQuote = signal(false);
}

@Component({
  imports: [
    CfRichTextDocumentComponent,
    CfRichTextNodeDirective,
    CfRichTextChildrenDirective,
  ],
  template: `
    @if (customFirst()) {
      <div id="custom" [cfRichTextDocument]="document()">
        <section *cfRichTextNode="BLOCKS.PARAGRAPH; let node = node">
          <ng-container [cfRichTextChildren]="node" />
        </section>
      </div>
      <div id="default" [cfRichTextDocument]="document()"></div>
    } @else {
      <div id="default" [cfRichTextDocument]="document()"></div>
      <div id="custom" [cfRichTextDocument]="document()">
        <section *cfRichTextNode="BLOCKS.PARAGRAPH; let node = node">
          <ng-container [cfRichTextChildren]="node" />
        </section>
      </div>
    }
  `,
})
class TwoDocumentsHostComponent {
  readonly BLOCKS = BLOCKS;
  readonly customFirst = signal(true);
  readonly document = signal<DocumentInput>(
    doc(block(BLOCKS.PARAGRAPH, [text('Hi')])),
  );
}

async function render<T>(host: Type<T>): Promise<ComponentFixture<T>> {
  const fixture = TestBed.createComponent(host);
  await fixture.whenStable();
  return fixture;
}

function query(fixture: ComponentFixture<unknown>, selector = '#doc'): Element {
  const element = (fixture.nativeElement as HTMLElement).querySelector(
    selector,
  );
  if (element == null) {
    throw new Error(`${selector} not found`);
  }
  return element;
}

async function renderDefault(document: DocumentInput): Promise<string> {
  const fixture = await render(DefaultHostComponent);
  fixture.componentInstance.document.set(document);
  await fixture.whenStable();
  return html(query(fixture));
}

describe('CfRichTextDocumentComponent', () => {
  describe('default templates', () => {
    it.each([
      [BLOCKS.PARAGRAPH, '<p>x</p>'],
      [BLOCKS.HEADING_1, '<h1>x</h1>'],
      [BLOCKS.HEADING_2, '<h2>x</h2>'],
      [BLOCKS.HEADING_3, '<h3>x</h3>'],
      [BLOCKS.HEADING_4, '<h4>x</h4>'],
      [BLOCKS.HEADING_5, '<h5>x</h5>'],
      [BLOCKS.HEADING_6, '<h6>x</h6>'],
      [BLOCKS.QUOTE, '<blockquote>x</blockquote>'],
      [BLOCKS.EMBEDDED_ENTRY, '<div>x</div>'],
    ])('renders %s', async (nodeType, expected) => {
      expect(await renderDefault(doc(block(nodeType, [text('x')])))).toBe(
        expected,
      );
    });

    it('renders an empty document', async () => {
      expect(await renderDefault(doc())).toBe('');
    });

    it('renders text nodes', async () => {
      expect(
        await renderDefault(
          doc(block(BLOCKS.PARAGRAPH, [text('a'), text(' & '), text('b')])),
        ),
      ).toBe('<p>a &amp; b</p>');
    });

    it.each([
      [BLOCKS.UL_LIST, 'ul'],
      [BLOCKS.OL_LIST, 'ol'],
    ])('renders %s with list items', async (nodeType, tag) => {
      expect(
        await renderDefault(
          doc(
            block(nodeType, [
              block(BLOCKS.LIST_ITEM, [block(BLOCKS.PARAGRAPH, [text('one')])]),
              block(BLOCKS.LIST_ITEM, [block(BLOCKS.PARAGRAPH, [text('two')])]),
            ]),
          ),
        ),
      ).toBe(`<${tag}><li><p>one</p></li><li><p>two</p></li></${tag}>`);
    });

    it(`renders ${BLOCKS.HR}`, async () => {
      expect(await renderDefault(doc(block(BLOCKS.HR)))).toBe('<hr>');
    });

    it(`renders ${BLOCKS.EMBEDDED_ASSET}`, async () => {
      const fixture = await render(DefaultHostComponent);
      fixture.componentInstance.document.set(
        doc(block(BLOCKS.EMBEDDED_ASSET, [], asset)),
      );
      await fixture.whenStable();
      const img = query(fixture).querySelector('img');
      expect(img?.getAttribute('src')).toBe('/image.png');
      expect(img?.getAttribute('alt')).toBe('Asset title');
      expect(img?.getAttribute('width')).toBe('266');
      expect(img?.getAttribute('height')).toBe('300');
    });

    it(`renders ${INLINES.HYPERLINK}`, async () => {
      expect(
        await renderDefault(
          doc(
            block(BLOCKS.PARAGRAPH, [
              inline(INLINES.HYPERLINK, [text('link')], {
                uri: 'https://example.com/',
              }),
            ]),
          ),
        ),
      ).toBe('<p><a href="https://example.com/">link</a></p>');
    });

    it.each([
      INLINES.ASSET_HYPERLINK,
      INLINES.ENTRY_HYPERLINK,
      INLINES.EMBEDDED_ENTRY,
    ])('renders %s', async nodeType => {
      expect(
        await renderDefault(
          doc(
            block(BLOCKS.PARAGRAPH, [
              inline(nodeType, [text('ignored')], entryTarget('id-1')),
            ]),
          ),
        ),
      ).toBe(`<p><span> type: ${nodeType} id: id-1</span></p>`);
    });

    it.each([
      [MARKS.BOLD, '<b>x</b>'],
      [MARKS.ITALIC, '<i>x</i>'],
      [MARKS.UNDERLINE, '<u>x</u>'],
      [MARKS.CODE, '<code>x</code>'],
    ])('renders %s mark', async (mark, expected) => {
      expect(
        await renderDefault(doc(block(BLOCKS.PARAGRAPH, [text('x', mark)]))),
      ).toBe(`<p>${expected}</p>`);
    });

    it('renders nested marks in order', async () => {
      expect(
        await renderDefault(
          doc(
            block(BLOCKS.PARAGRAPH, [
              text('plain '),
              text('all', MARKS.BOLD, MARKS.ITALIC, MARKS.UNDERLINE),
              text('ib', MARKS.ITALIC, MARKS.BOLD),
            ]),
          ),
        ),
      ).toBe('<p>plain <b><i><u>all</u></i></b><i><b>ib</b></i></p>');
    });

    it.each([BLOCKS.TABLE, BLOCKS.EMBEDDED_RESOURCE])(
      'skips %s which has no template',
      async nodeType => {
        expect(
          await renderDefault(
            doc(block(nodeType), block(BLOCKS.PARAGRAPH, [text('after')])),
          ),
        ).toBe('<p>after</p>');
      },
    );
  });

  describe('document input', () => {
    it('links GraphQL entries and assets', async () => {
      const fixture = await render(CustomHostComponent);
      fixture.componentInstance.document.set({
        json: doc(block(BLOCKS.EMBEDDED_ENTRY, [], entryTarget('entry-1'))),
        links: {
          entries: {
            block: [
              { sys: { id: 'entry-1' }, fields: { title: 'Linked' } } as never,
            ],
          },
        },
      });
      await fixture.whenStable();
      expect(html(query(fixture))).toBe('<article> Linked </article>');
    });

    it('re-renders when the document changes', async () => {
      const fixture = await render(DefaultHostComponent);
      fixture.componentInstance.document.set(
        doc(block(BLOCKS.PARAGRAPH, [text('first')])),
      );
      await fixture.whenStable();
      fixture.componentInstance.document.set(
        doc(block(BLOCKS.HEADING_1, [text('second')])),
      );
      await fixture.whenStable();
      expect(html(query(fixture))).toBe('<h1>second</h1>');
    });

    it('keeps rendered nodes when a deep-equal document is set', async () => {
      const fixture = await render(DefaultHostComponent);
      fixture.componentInstance.document.set(
        doc(block(BLOCKS.PARAGRAPH, [text('same')])),
      );
      await fixture.whenStable();
      const paragraph = query(fixture).querySelector('p');

      fixture.componentInstance.document.set(
        doc(block(BLOCKS.PARAGRAPH, [text('same')])),
      );
      await fixture.whenStable();
      expect(query(fixture).querySelector('p')).toBe(paragraph);
    });

    it.each([null, undefined])(
      'keeps the previous document when set to %s',
      async value => {
        const fixture = await render(DefaultHostComponent);
        fixture.componentInstance.document.set(
          doc(block(BLOCKS.PARAGRAPH, [text('kept')])),
        );
        await fixture.whenStable();
        fixture.componentInstance.document.set(value);
        await fixture.whenStable();
        expect(html(query(fixture))).toBe('<p>kept</p>');
      },
    );

    it('renders nothing when initially null', async () => {
      expect(await renderDefault(null)).toBe('');
    });
  });

  describe('custom templates', () => {
    it('override default node and mark templates', async () => {
      const fixture = await render(CustomHostComponent);
      fixture.componentInstance.document.set(
        doc(
          block(BLOCKS.HEADING_2, [text('title')]),
          block(BLOCKS.PARAGRAPH, [
            text('bold', MARKS.BOLD),
            text('italic', MARKS.ITALIC),
            text('const x = 1;', MARKS.CODE),
          ]),
        ),
      );
      await fixture.whenStable();
      expect(html(query(fixture))).toBe(
        '<h2>title</h2><section><strong>bold</strong><i>italic</i><pre>const x = 1;</pre></section>',
      );
    });

    it('combine custom and default marks when nested', async () => {
      const fixture = await render(CustomHostComponent);
      fixture.componentInstance.document.set(
        doc(
          block(BLOCKS.PARAGRAPH, [
            text('x', MARKS.ITALIC, MARKS.BOLD, MARKS.UNDERLINE),
          ]),
        ),
      );
      await fixture.whenStable();
      expect(html(query(fixture))).toBe(
        '<section><i><strong><u>x</u></strong></i></section>',
      );
    });

    it('picks up templates added after the first render', async () => {
      const fixture = await render(CustomHostComponent);
      fixture.componentInstance.document.set(
        doc(block(BLOCKS.QUOTE, [block(BLOCKS.PARAGRAPH, [text('q')])])),
      );
      await fixture.whenStable();
      expect(html(query(fixture))).toBe(
        '<blockquote><section>q</section></blockquote>',
      );

      fixture.componentInstance.showQuote.set(true);
      await fixture.whenStable();
      expect(html(query(fixture))).toBe('<aside><section>q</section></aside>');
    });
  });

  describe('multiple documents', () => {
    it.each([true, false])(
      'do not share custom templates (custom first: %s)',
      async customFirst => {
        const fixture = TestBed.createComponent(TwoDocumentsHostComponent);
        fixture.componentInstance.customFirst.set(customFirst);
        await fixture.whenStable();
        expect(html(query(fixture, '#custom'))).toBe('<section>Hi</section>');
        expect(html(query(fixture, '#default'))).toBe('<p>Hi</p>');
      },
    );

    it('keep templates separate after re-rendering', async () => {
      const fixture = await render(TwoDocumentsHostComponent);
      fixture.componentInstance.document.set(
        doc(block(BLOCKS.PARAGRAPH, [text('Updated')])),
      );
      await fixture.whenStable();
      expect(html(query(fixture, '#custom'))).toBe(
        '<section>Updated</section>',
      );
      expect(html(query(fixture, '#default'))).toBe('<p>Updated</p>');
    });
  });
});
