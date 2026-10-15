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
    effect(onCleanup => {
      const type = this.cfRichTextNode();
      this.templatesService.addTemplate(
        type,
        this.templateRef,
        this.cfRichTextNodeIsDefault(),
      );
      // runs when the type changes or the directive is destroyed
      onCleanup(() => {
        this.templatesService.removeTemplate(type, this.templateRef);
      });
    });
  }
}
