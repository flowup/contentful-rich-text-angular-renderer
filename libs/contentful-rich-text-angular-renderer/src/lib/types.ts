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
