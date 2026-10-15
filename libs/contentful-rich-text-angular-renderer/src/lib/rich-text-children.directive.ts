import {
  Directive,
  effect,
  inject,
  input,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { Text } from '@contentful/rich-text-types';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { CommonNode, TemplateMap } from './types';

@Directive({
  selector: '[cfRichTextChildren]',
})
export class CfRichTextChildrenDirective {
  readonly cfRichTextChildren = input.required<CommonNode>();

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templatesService = inject(CfRichTextTemplatesService);

  constructor() {
    effect(onCleanup => {
      const parentNode = this.cfRichTextChildren();
      // the document re-renders the whole tree when templates change
      untracked(() => {
        this.renderChildren(parentNode);
      });
      onCleanup(() => {
        this.viewContainerRef.clear();
      });
    });
  }

  private renderChildren(parentNode: CommonNode): void {
    if (parentNode.nodeType === 'text') {
      this.renderTextNode(parentNode);
    } else {
      parentNode.content.forEach(childNode => {
        if (childNode.nodeType === 'text') {
          this.renderTextNode(childNode);
        } else {
          this.renderNode(childNode.nodeType, childNode);
        }
      });
    }
  }

  private renderTextNode(node: Text): void {
    // marks without a template are skipped, the text keeps its other marks
    const templates: Partial<TemplateMap> = this.templatesService.templates();
    const markIndex = node.marks.findIndex(mark => templates[mark.type]);
    if (markIndex === -1) {
      this.renderNode(node.nodeType, node);
    } else {
      this.renderNode(node.marks[markIndex].type, {
        ...node,
        marks: node.marks.slice(markIndex + 1),
      });
    }
  }

  private renderNode(type: string, node: CommonNode): void {
    // not every node or mark type has a template
    const templates: Partial<TemplateMap> = this.templatesService.templates();
    const template = templates[type];
    if (template) {
      this.viewContainerRef.createEmbeddedView(template, { node });
    }
  }
}
