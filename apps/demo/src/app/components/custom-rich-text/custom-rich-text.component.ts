import { Component, Input } from '@angular/core';
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
  styleUrls: ['./custom-rich-text.component.scss'],
  standalone: true,
  imports: [
    CfRichTextDocumentComponent,
    CfRichTextNodeDirective,
    CfRichTextMarkDirective,
    CfRichTextChildrenDirective,
    HighlightjsPipe,
  ],
})
export class CustomRichTextComponent {
  @Input({required: true}) document!: Document;

  readonly BLOCKS = BLOCKS;
  readonly MARKS = MARKS;
  readonly INLINES = INLINES;
}
