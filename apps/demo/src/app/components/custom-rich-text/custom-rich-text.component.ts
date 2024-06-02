import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import { HighlightjsPipe } from '../../pipes/highlightjs.pipe';
import {
  CfRichTextChildrenDirective,
  CfRichTextMarkDirective,
  CfRichTextNodeDirective,
  CfRichTextDocumentComponent,
} from '@flowup/contentful-rich-text-angular-renderer';

@Component({
  selector: 'demo-custom-rich-text',
  templateUrl: './custom-rich-text.component.html',
  styleUrls: ['./custom-rich-text.component.scss'],
  standalone: true,
  imports: [
    CfRichTextDocumentComponent,
    CfRichTextNodeDirective,
    NgIf,
    CfRichTextMarkDirective,
    CfRichTextChildrenDirective,
    HighlightjsPipe,
  ],
})
export class CustomRichTextComponent {
  @Input() document: Document;

  readonly BLOCKS = BLOCKS;
  readonly MARKS = MARKS;
  readonly INLINES = INLINES;
}
