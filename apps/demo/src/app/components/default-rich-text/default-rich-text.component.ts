import { Component, Input } from '@angular/core';
import { Document } from '@contentful/rich-text-types';

@Component({
  selector: 'demo-default-rich-text',
  templateUrl: './default-rich-text.component.html',
  styleUrls: ['./default-rich-text.component.scss'],
})
export class DefaultRichTextComponent {
  @Input() document: Document;
}
