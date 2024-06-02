import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import { JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';
import type { Asset, AssetFile, Entry } from 'contentful';
import { CustomRichTextComponent } from './components/custom-rich-text/custom-rich-text.component';
import { DefaultRichTextComponent } from './components/default-rich-text/default-rich-text.component';
import { BlogPostEntryFields } from './types';

const initialDocument: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.HEADING_1,
      data: {},
      content: [
        { nodeType: 'text', value: 'Heading - level 1', data: {}, marks: [] },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'This is some paragraph text...',
          data: {},
          marks: [],
        },
      ],
    },
    {
      nodeType: BLOCKS.HEADING_2,
      data: {},
      content: [
        { nodeType: 'text', value: 'Heading - level 2', data: {}, marks: [] },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Rich text can contain ',
          data: {},
          marks: [],
        },
        {
          nodeType: 'text',
          value: 'bold text',
          data: {},
          marks: [{ type: MARKS.BOLD }],
        },
        {
          nodeType: 'text',
          value: ', ',
          data: {},
          marks: [],
        },
        {
          nodeType: 'text',
          value: 'italic text',
          data: {},
          marks: [{ type: MARKS.ITALIC }],
        },
        {
          nodeType: 'text',
          value: ', ',
          data: {},
          marks: [],
        },
        {
          nodeType: INLINES.HYPERLINK,
          data: { uri: '#' },
          content: [
            { nodeType: 'text', value: 'hyperlinks', data: [], marks: [] },
          ],
        },
        {
          nodeType: 'text',
          value: ', etc.',
          data: {},
          marks: [],
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'As for code, it can be inline (e.g. ',
          data: {},
          marks: [],
        },
        {
          nodeType: 'text',
          value: "console.log('Hello, world!')",
          data: {},
          marks: [{ type: MARKS.CODE }],
        },
        {
          nodeType: 'text',
          value: '), or as a code block:',
          data: {},
          marks: [],
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value:
          // eslint-disable-next-line no-template-curly-in-string
            'function greet(name: string): string {\n  return `Hello, ${name}!`\n}',
          data: {},
          marks: [{ type: MARKS.CODE }],
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Ordered and unordered lists are supported:',
          data: {},
          marks: [],
        },
        {
          nodeType: BLOCKS.OL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                { nodeType: 'text', value: 'one', data: {}, marks: [] },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                { nodeType: 'text', value: 'two', data: {}, marks: [] },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                { nodeType: 'text', value: 'three', data: {}, marks: [] },
                {
                  nodeType: BLOCKS.UL_LIST,
                  data: {},
                  content: [
                    {
                      nodeType: BLOCKS.LIST_ITEM,
                      data: {},
                      content: [
                        { nodeType: 'text', value: 'foo', data: {}, marks: [] },
                      ],
                    },
                    {
                      nodeType: BLOCKS.LIST_ITEM,
                      data: {},
                      content: [
                        { nodeType: 'text', value: 'bar', data: {}, marks: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'You can also embed a Contentful asset:',
          data: {},
          marks: [],
        },
      ],
    },
    {
      nodeType: BLOCKS.EMBEDDED_ASSET,
      content: [],
      data: {
        target: {
          fields: {
            title: 'Image title',
            description: 'Image description',
            file: {
              url: 'https://seeklogo.com/images/C/contentful-logo-C395C545BF-seeklogo.com.png',
              details: {size: 1000},
              fileName: 'cf-logo.png',
              contentType: 'Asset'
            } satisfies AssetFile,
          },
        } as unknown as Asset,
      },
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value:
            'And you can even embed a Contentful entry (and implement your own custom rendering):',
          data: {},
          marks: [],
        },
      ],
    },
    {
      nodeType: BLOCKS.EMBEDDED_ENTRY,
      content: [],
      data: {
        target: {
          sys: { id: '1234' },
          fields: {
            title: 'My blog post',
            description: 'Blog post description',
            image: {
              fields: {
                file: {
                  url: 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif',
                },
              },
            },
            author: {
              fields: {
                firstName: 'John',
                lastName: 'Doe',
                photo: {
                  fields: {
                    file: {
                      url: 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif',
                    },
                  },
                },
              },
            },
          },
        } as unknown as Entry<BlogPostEntryFields>,
      },
    },
  ],
};

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NgJsonEditorModule,
    ReactiveFormsModule,
    DefaultRichTextComponent,
    CustomRichTextComponent,
  ],
})
export class AppComponent {
  readonly formControl = new FormControl(initialDocument);
  readonly jsonOptions = new JsonEditorOptions();

  constructor() {
    this.jsonOptions.modes = ['code', 'tree', 'view'];
    this.jsonOptions.enableSort = false;
    this.jsonOptions.enableTransform = false;
  }
}
