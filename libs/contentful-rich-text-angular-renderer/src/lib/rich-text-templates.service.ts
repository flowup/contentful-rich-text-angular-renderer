import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeContext, TemplateMap } from './types';

// Provided by each CfRichTextDocumentComponent, so custom templates don't leak between documents
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class CfRichTextTemplatesService implements OnDestroy {
  private readonly templatesState$ = new BehaviorSubject<TemplateMap>({});
  readonly templates$ = this.templatesState$.asObservable();

  get templates(): TemplateMap {
    return this.templatesState$.value;
  }

  addTemplate(
    // node type or mark type
    type: string,
    templateRef: TemplateRef<NodeContext>,
    isDefault: boolean,
  ): void {
    if (!isDefault || !Object.hasOwn(this.templates, type)) {
      this.templatesState$.next({
        ...this.templates,
        [type]: templateRef,
      });
    }
  }

  ngOnDestroy(): void {
    this.templatesState$.complete();
  }
}
