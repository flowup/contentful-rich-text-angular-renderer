import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { CommonNodeType, NodeContext, TemplateMap } from './types';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CfRichTextTemplatesService implements OnDestroy {
  private readonly templatesState$ = new BehaviorSubject<TemplateMap>({});
  readonly templates$ = this.templatesState$.asObservable();

  get templates(): TemplateMap {
    return this.templatesState$.value;
  }

  addTemplate(
    nodeType: CommonNodeType | string,
    templateRef: TemplateRef<NodeContext>,
    isDefault: boolean,
  ): void {
    if (!isDefault || this.templates[nodeType] == null) {
      this.templatesState$.next({
        ...this.templates,
        [nodeType]: templateRef,
      });
    }
  }

  ngOnDestroy(): void {
    this.templatesState$.complete();
  }
}
