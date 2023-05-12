import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import  equal from 'fast-deep-equal/es6';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { linkDocumentEntriesAndAssets } from './helpers';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { RichTextFieldFragmentGQL } from './types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[cfRichTextDocument]',
  templateUrl: './rich-text-document.component.html',
  providers: [CfRichTextTemplatesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfRichTextDocumentComponent implements OnInit, OnDestroy {
  readonly BLOCKS = BLOCKS;
  readonly INLINES = INLINES;
  readonly MARKS = MARKS;

  private readonly viewContainer$ = new Subject<ViewContainerRef>();
  private readonly document$ = new BehaviorSubject<Document>({
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [],
  });

  private readonly templatesService = inject(CfRichTextTemplatesService);
  private readonly cdRef = inject(ChangeDetectorRef);

  @Input() set cfRichTextDocument(
    value: Document | RichTextFieldFragmentGQL | null | undefined,
  ) {
    if (value != null) {
      this.document$.next(
        'json' in value ? linkDocumentEntriesAndAssets(value) : value,
      );
    }
  }

  @ViewChild('viewContainer', { read: ViewContainerRef })
  set viewContainer(viewContainer: ViewContainerRef) {
    this.viewContainer$.next(viewContainer);
  }

  ngOnInit(): void {
    combineLatest([
      this.viewContainer$,
      this.document$.pipe(distinctUntilChanged(equal)),
      this.templatesService.templates$,
    ]).subscribe(([viewContainerRef, doc, templates]) => {
      viewContainerRef.clear();
      const template = templates[doc.nodeType];
      if (template) {
        viewContainerRef.createEmbeddedView(template, {
          node: doc,
        });
      }
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.viewContainer$.complete();
    this.document$.complete();
  }
}
