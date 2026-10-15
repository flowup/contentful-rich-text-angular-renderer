import { Directive, effect, inject, input, TemplateRef } from '@angular/core';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { CommonNodeType, NodeContext } from './types';

@Directive({
  selector: '[cfRichTextNode]',
})
export class CfRichTextNodeDirective {
  readonly cfRichTextNode = input.required<CommonNodeType>();
  readonly cfRichTextNodeIsDefault = input(false);

  private readonly templatesService = inject(CfRichTextTemplatesService);
  private readonly templateRef = inject<TemplateRef<NodeContext>>(TemplateRef);

  constructor() {
    effect(() => {
      this.templatesService.addTemplate(
        this.cfRichTextNode(),
        this.templateRef,
        this.cfRichTextNodeIsDefault(),
      );
    });
  }
}
