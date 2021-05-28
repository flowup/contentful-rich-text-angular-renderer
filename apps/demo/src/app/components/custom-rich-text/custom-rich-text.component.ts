import { Component, Input } from '@angular/core';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';

@Component({
  selector: 'demo-custom-rich-text',
  templateUrl: './custom-rich-text.component.html',
  styleUrls: ['./custom-rich-text.component.scss'],
})
export class CustomRichTextComponent {
  @Input() document: Document;

  readonly BLOCKS = BLOCKS;
  readonly MARKS = MARKS;
  readonly INLINES = INLINES;
}
