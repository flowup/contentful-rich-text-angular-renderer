import { Injectable, signal, TemplateRef } from '@angular/core';
import { NodeContext, TemplateMap } from './types';

// Provided by each CfRichTextDocumentComponent, so custom templates don't leak between documents
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class CfRichTextTemplatesService {
  private readonly templatesState = signal<TemplateMap>({});
  readonly templates = this.templatesState.asReadonly();

  addTemplate(
    // node type or mark type
    type: string,
    templateRef: TemplateRef<NodeContext>,
    isDefault: boolean,
  ): void {
    this.templatesState.update(templates =>
      !isDefault || !Object.hasOwn(templates, type)
        ? { ...templates, [type]: templateRef }
        : templates,
    );
  }
}
