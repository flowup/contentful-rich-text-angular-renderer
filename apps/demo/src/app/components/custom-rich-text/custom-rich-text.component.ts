import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import {
  CfRichTextChildrenDirective,
  CfRichTextMarkDirective,
  CfRichTextNodeDirective,
  CfRichTextDocumentComponent,
} from '@flowup/contentful-rich-text-angular-renderer';
import { HighlightjsPipe } from '../../pipes/highlightjs.pipe';

@Component({
  selector: 'demo-custom-rich-text',
  templateUrl: './custom-rich-text.component.html',
  styleUrl: './custom-rich-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CfRichTextDocumentComponent,
    CfRichTextNodeDirective,
    CfRichTextMarkDirective,
    CfRichTextChildrenDirective,
    HighlightjsPipe,
    NgOptimizedImage,
  ],
})
export class CustomRichTextComponent {
  readonly document = input.required<Document>();

  readonly BLOCKS = BLOCKS;
  readonly MARKS = MARKS;
  readonly INLINES = INLINES;
}
