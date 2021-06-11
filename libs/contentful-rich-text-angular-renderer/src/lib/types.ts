import { TemplateRef } from '@angular/core';
import { Block, Inline, Text } from '@contentful/rich-text-types';

export type CommonNode = Text | Block | Inline;
export type CommonNodeType = CommonNode['nodeType'];

export interface NodeContext {
  node: CommonNode;
}

export type TemplateMap = {
  [nodeType in CommonNodeType]?: TemplateRef<NodeContext>;
} & {
  [markType: string]: TemplateRef<NodeContext>;
};

export type EntryNodeData = {
  target: { sys: { id: string } };
};

export type AssetNodeData = {
  target: { sys: { id: string } };
};

export type RichTextFieldFragmentGQL = {
  json: unknown;
  links?: {
    entries?: {
      inline?: MaybeGQL<EmbeddedEntryFragmentGQL>[];
      hyperlink?: MaybeGQL<EmbeddedEntryFragmentGQL>[];
      block?: MaybeGQL<EmbeddedEntryFragmentGQL>[];
    };
    assets?: {
      hyperlink?: MaybeGQL<EmbeddedAssetFragmentGQL>[];
      block?: MaybeGQL<EmbeddedAssetFragmentGQL>[];
    };
  };
};

export type MaybeGQL<T> = T | null | undefined;

export type EmbeddedEntryFragmentGQL = {
  sys?: {
    id?: string;
  };
};

export type EmbeddedAssetFragmentGQL = {
  sys?: {
    id?: string;
  };
};
