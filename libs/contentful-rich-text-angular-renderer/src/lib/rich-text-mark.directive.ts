import { Directive, effect, inject, input, TemplateRef } from '@angular/core';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { NodeContext } from './types';

@Directive({
  selector: '[cfRichTextMark]',
})
export class CfRichTextMarkDirective {
  readonly cfRichTextMark = input.required<string>();
  readonly cfRichTextMarkIsDefault = input(false);

  private readonly templatesService = inject(CfRichTextTemplatesService);
  private readonly templateRef = inject<TemplateRef<NodeContext>>(TemplateRef);

  constructor() {
    effect(() => {
      this.templatesService.addTemplate(
        this.cfRichTextMark(),
        this.templateRef,
        this.cfRichTextMarkIsDefault(),
      );
    });
  }
}
