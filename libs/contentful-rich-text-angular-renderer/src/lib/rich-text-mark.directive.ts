import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { NodeContext } from './types';

@Directive({
  selector: '[cfRichTextMark]',
  standalone: true,
})
export class CfRichTextMarkDirective implements OnInit, OnDestroy {
  private readonly type$ = new BehaviorSubject<string | null>(null);
  private readonly isDefault$ = new BehaviorSubject<boolean>(false);

  private readonly templatesService = inject(CfRichTextTemplatesService);
  private readonly templateRef = inject(TemplateRef<NodeContext>);

  @Input() set cfRichTextMark(type: string) {
    this.type$.next(type);
  }

  @Input() set cfRichTextMarkIsDefault(value: boolean) {
    this.isDefault$.next(value);
  }

  ngOnInit(): void {
    combineLatest([this.type$, this.isDefault$]).subscribe(
      ([type, isDefault]) => {
        if (type != null) {
          this.templatesService.addTemplate(type, this.templateRef, isDefault);
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.type$.complete();
    this.isDefault$.complete();
  }
}
