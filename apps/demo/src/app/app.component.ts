import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { Asset, Entry } from 'contentful';
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
              url:
                'https://seeklogo.com/images/C/contentful-logo-C395C545BF-seeklogo.com.png',
            },
          },
        } as Asset,
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
                  url:
                    'https://seeklogo.com/images/A/angular-logo-B76B1CDE98-seeklogo.com.png',
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
                      url:
                        'https://www.scubadiving.com/sites/scubadiving.com/files/styles/opengraph_1_91x1/public/images/2015/10/darth-vader.jpg?itok=fW9Tvc0i',
                    },
                  },
                },
              },
            },
          },
        } as Entry<BlogPostEntryFields>,
      },
    },
  ],
};

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
