import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef
} from "@angular/core";
import { BehaviorSubject, combineLatest } from 'rxjs';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { CommonNodeType, NodeContext } from './types';

@Directive({
  selector: '[cfRichTextNode]',
})
export class CfRichTextNodeDirective implements OnInit, OnDestroy {
  private readonly nodeType$ = new BehaviorSubject<CommonNodeType | null>(null);
  private readonly isDefault$ = new BehaviorSubject<boolean>(false);

  private readonly templatesService = inject(CfRichTextTemplatesService);
  private readonly templateRef = inject(TemplateRef<NodeContext>) ;

  @Input() set cfRichTextNode(nodeType: CommonNodeType) {
    this.nodeType$.next(nodeType);
  }

  @Input() set cfRichTextNodeIsDefault(value: boolean) {
    this.isDefault$.next(value);
  }

  ngOnInit(): void {
    combineLatest([this.nodeType$, this.isDefault$]).subscribe(
      ([nodeType, isDefault]) => {
        if (nodeType != null) {
          this.templatesService.addTemplate(
            nodeType,
            this.templateRef,
            isDefault,
          );
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.nodeType$.complete();
    this.isDefault$.complete();
  }
}
