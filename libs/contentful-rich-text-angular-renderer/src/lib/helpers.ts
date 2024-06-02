import { BLOCKS, Document, INLINES, Node } from '@contentful/rich-text-types';
import {
  AssetNodeData,
  CommonNode,
  EmbeddedAssetFragmentGQL,
  EmbeddedEntryFragmentGQL,
  EntryNodeData,
  RichTextFieldFragmentGQL,
} from './types';

export function linkDocumentEntriesAndAssets(
  gqlRichText: RichTextFieldFragmentGQL,
): Document {
  const entryMap = new Map<string, EmbeddedEntryFragmentGQL>();
  const assetMap = new Map<string, EmbeddedAssetFragmentGQL>();
  const entries = [
    ...(gqlRichText.links?.entries?.inline ?? []),
    ...(gqlRichText.links?.entries?.block ?? []),
    ...(gqlRichText.links?.entries?.hyperlink ?? []),
  ];
  const assets = [
    ...(gqlRichText.links?.assets?.block ?? []),
    ...(gqlRichText.links?.assets?.hyperlink ?? []),
  ];
  entries.forEach(entry => {
    if (entry?.sys?.id != null) {
      entryMap.set(entry.sys.id, entry);
    }
  });
  assets.forEach(asset => {
    if (asset?.sys?.id != null) {
      assetMap.set(asset.sys.id, asset);
    }
  });
  return addLinksToNodeAndChildren({
    node: gqlRichText.json as Document,
    entryMap,
    assetMap,
  }) as Document;
}

function addLinksToNodeAndChildren(args: {
  node: Node;
  entryMap: ReadonlyMap<string, EmbeddedEntryFragmentGQL>;
  assetMap: ReadonlyMap<string, EmbeddedAssetFragmentGQL>;
}): Node {
  const node = args.node as CommonNode;
  return {
    ...addLinkToNode(args),
    ...('content' in node &&
      Array.isArray(node.content) && {
        content: (node.content as Node[]).map(childNode =>
          addLinksToNodeAndChildren({ ...args, node: childNode }),
        ),
      }),
  };
}

function addLinkToNode(args: {
  node: Node;
  entryMap: ReadonlyMap<string, EmbeddedEntryFragmentGQL>;
  assetMap: ReadonlyMap<string, EmbeddedAssetFragmentGQL>;
}): Node {
  const { node, entryMap, assetMap } = args;
  switch (node.nodeType) {
    case BLOCKS.EMBEDDED_ASSET:
    case INLINES.ASSET_HYPERLINK: {
      const assetNodeData = node.data as AssetNodeData;
      return {
        ...node,
        data: {
          ...assetNodeData,
          target: {
            ...assetNodeData.target,
            ...assetMap.get(assetNodeData.target.sys.id),
          },
        },
      };
    }
    case BLOCKS.EMBEDDED_ENTRY:
    case INLINES.EMBEDDED_ENTRY:
    case INLINES.ENTRY_HYPERLINK: {
      const entryNodeData = node.data as EntryNodeData;
      return {
        ...node,
        data: {
          ...entryNodeData,
          target: {
            ...entryNodeData.target,
            ...entryMap.get(entryNodeData.target.sys.id),
          },
        },
      };
    }
    default:
      return node;
  }
}
