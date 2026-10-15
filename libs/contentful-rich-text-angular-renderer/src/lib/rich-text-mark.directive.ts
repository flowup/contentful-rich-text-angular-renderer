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
    effect(onCleanup => {
      const type = this.cfRichTextMark();
      this.templatesService.addTemplate(
        type,
        this.templateRef,
        this.cfRichTextMarkIsDefault(),
      );
      // runs when the type changes or the directive is destroyed
      onCleanup(() => {
        this.templatesService.removeTemplate(type, this.templateRef);
      });
    });
  }
}
