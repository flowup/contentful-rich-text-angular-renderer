import { Component, Input } from '@angular/core';
import { Document } from '@contentful/rich-text-types';

@Component({
  selector: 'demo-custom-rich-text',
  templateUrl: './custom-rich-text.component.html',
  styleUrls: ['./custom-rich-text.component.scss'],
})
export class CustomRichTextComponent {
  @Input() document: Document;
}
