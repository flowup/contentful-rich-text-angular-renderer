import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import * as equal from 'fast-deep-equal/es6';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CfRichTextTemplatesService } from './rich-text-templates.service';

@Component({
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

  constructor(
    private readonly templatesService: CfRichTextTemplatesService,
    private readonly cdRef: ChangeDetectorRef,
  ) {}

  @Input() set cfRichTextDocument(doc: Document) {
    if (doc != null) {
      this.document$.next(doc);
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
