import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Text } from '@contentful/rich-text-types';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { CommonNode, NodeContext } from './types';

@Directive({
  selector: '[cfRichTextChildren]',
  standalone: true,
})
export class CfRichTextChildrenDirective implements OnDestroy {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templatesService = inject(CfRichTextTemplatesService);

  private nodes: EmbeddedViewRef<NodeContext>[] = [];

  @Input() set cfRichTextChildren(parentNode: CommonNode) {
    if (parentNode.nodeType === 'text') {
      this.renderTextNode(parentNode);
    } else {
      parentNode.content.forEach(childNode => {
        if (childNode.nodeType === 'text') {
          this.renderTextNode(childNode);
        } else {
          const template = this.templatesService.templates[childNode.nodeType];
          if (template) {
            this.nodes.push(
              this.viewContainerRef.createEmbeddedView(template, {
                node: childNode,
              }),
            );
          }
        }
      });
    }
  }

  private renderTextNode(node: Text): void {
    const [mark, ...otherMarks] = node.marks;
    if (node.marks.length > 0) {
      const childNode = { ...node, marks: otherMarks };
      this.nodes.push(
        this.viewContainerRef.createEmbeddedView(
          this.templatesService.templates[mark.type],
          { node: childNode },
        ),
      );
    } else {
      const template = this.templatesService.templates[node.nodeType];
      if (template) {
        this.nodes.push(
          this.viewContainerRef.createEmbeddedView(template, { node }),
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
    this.nodes.forEach(ref => {
      ref.destroy();
    });
    this.nodes = [];
  }
}
