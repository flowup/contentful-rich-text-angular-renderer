import { BLOCKS, Document, INLINES } from '@contentful/rich-text-types';
import { linkDocumentEntriesAndAssets } from './helpers';

describe('linkDocumentEntriesAndAssets', () => {
  const json: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_ENTRY,
        data: { target: { sys: { id: 'entry-1', type: 'Link' } } },
        content: [],
      },
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        data: { target: { sys: { id: 'asset-1', type: 'Link' } } },
        content: [],
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: INLINES.EMBEDDED_ENTRY,
            data: { target: { sys: { id: 'entry-2' } } },
            content: [],
          },
          {
            nodeType: INLINES.ENTRY_HYPERLINK,
            data: { target: { sys: { id: 'entry-3' } } },
            content: [
              { nodeType: 'text', value: 'entry link', marks: [], data: {} },
            ],
          },
          {
            nodeType: INLINES.ASSET_HYPERLINK,
            data: { target: { sys: { id: 'asset-2' } } },
            content: [
              { nodeType: 'text', value: 'asset link', marks: [], data: {} },
            ],
          },
          {
            nodeType: INLINES.HYPERLINK,
            data: { uri: 'https://example.com' },
            content: [{ nodeType: 'text', value: 'web', marks: [], data: {} }],
          },
          {
            nodeType: INLINES.EMBEDDED_ENTRY,
            data: { target: { sys: { id: 'missing' } } },
            content: [],
          },
        ],
      },
    ],
  };

  const linked = linkDocumentEntriesAndAssets({
    json,
    links: {
      entries: {
        block: [{ sys: { id: 'entry-1' }, title: 'Block entry' } as never],
        inline: [
          null,
          { sys: { id: 'entry-2' }, title: 'Inline entry' } as never,
        ],
        hyperlink: [
          undefined,
          { sys: { id: 'entry-3' }, title: 'Linked entry' } as never,
          { sys: {} },
        ],
      },
      assets: {
        block: [{ sys: { id: 'asset-1' }, url: '/block.png' } as never],
        hyperlink: [{ sys: { id: 'asset-2' }, url: '/linked.pdf' } as never],
      },
    },
  });
  const [blockEntry, blockAsset, paragraph] = linked.content;
  const [inlineEntry, entryLink, assetLink, hyperlink, missing] =
    paragraph.content;

  it('merges linked entries into block, inline and hyperlink entry targets', () => {
    expect(blockEntry.data['target']).toEqual({
      sys: { id: 'entry-1' },
      title: 'Block entry',
    });
    expect(inlineEntry.data['target']).toEqual({
      sys: { id: 'entry-2' },
      title: 'Inline entry',
    });
    expect(entryLink.data['target']).toEqual({
      sys: { id: 'entry-3' },
      title: 'Linked entry',
    });
  });

  it('merges linked assets into block and hyperlink asset targets', () => {
    expect(blockAsset.data['target']).toEqual({
      sys: { id: 'asset-1' },
      url: '/block.png',
    });
    expect(assetLink.data['target']).toEqual({
      sys: { id: 'asset-2' },
      url: '/linked.pdf',
    });
  });

  it('keeps unrelated nodes, unresolved links and children intact', () => {
    expect(hyperlink).toEqual(json.content[2].content[3]);
    expect(missing.data['target']).toEqual({ sys: { id: 'missing' } });
    expect(entryLink).toHaveProperty('content', [
      { nodeType: 'text', value: 'entry link', marks: [], data: {} },
    ]);
  });

  it('does not mutate the GraphQL json', () => {
    expect(json.content[0].data['target']).toEqual({
      sys: { id: 'entry-1', type: 'Link' },
    });
  });

  it('handles missing links', () => {
    expect(linkDocumentEntriesAndAssets({ json })).toEqual(json);
  });
});
