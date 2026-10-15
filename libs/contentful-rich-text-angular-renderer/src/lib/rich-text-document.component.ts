import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import equal from 'fast-deep-equal/es6';
import { linkDocumentEntriesAndAssets } from './helpers';
import { CfRichTextChildrenDirective } from './rich-text-children.directive';
import { CfRichTextMarkDirective } from './rich-text-mark.directive';
import { CfRichTextNodeDirective } from './rich-text-node.directive';
import { CfRichTextTemplatesService } from './rich-text-templates.service';
import { RichTextFieldFragmentGQL } from './types';

const EMPTY_DOCUMENT: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [],
};

@Component({
  selector: '[cfRichTextDocument]',
  templateUrl: './rich-text-document.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CfRichTextTemplatesService],
  imports: [
    CfRichTextNodeDirective,
    CfRichTextChildrenDirective,
    CfRichTextMarkDirective,
    NgOptimizedImage,
  ],
})
export class CfRichTextDocumentComponent {
  readonly BLOCKS = BLOCKS;
  readonly INLINES = INLINES;
  readonly MARKS = MARKS;

  readonly cfRichTextDocument = input<
    Document | RichTextFieldFragmentGQL | null | undefined
  >();

  private readonly templatesService = inject(CfRichTextTemplatesService);
  private readonly viewContainer = viewChild('viewContainer', {
    read: ViewContainerRef,
  });

  // null and undefined keep the last rendered document
  private readonly document = linkedSignal<
    Document | RichTextFieldFragmentGQL | null | undefined,
    Document
  >({
    source: this.cfRichTextDocument,
    computation: (value, previous) => {
      if (value == null) {
        return previous?.value ?? EMPTY_DOCUMENT;
      }
      return 'json' in value ? linkDocumentEntriesAndAssets(value) : value;
    },
    equal,
  });

  constructor() {
    effect(() => {
      const viewContainerRef = this.viewContainer();
      const doc = this.document();
      const template = this.templatesService.templates()[doc.nodeType];
      untracked(() => {
        viewContainerRef?.clear();
        if (template) {
          viewContainerRef?.createEmbeddedView(template, { node: doc });
        }
      });
    });
  }
}
