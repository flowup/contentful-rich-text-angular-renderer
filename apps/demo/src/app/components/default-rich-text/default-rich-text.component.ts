import { Component, Input } from '@angular/core';
import { Document } from '@contentful/rich-text-types';
import { CfRichTextDocumentComponent } from '@flowup/contentful-rich-text-angular-renderer';

@Component({
  selector: 'demo-default-rich-text',
  templateUrl: './default-rich-text.component.html',
  styleUrls: ['./default-rich-text.component.scss'],
  standalone: true,
  imports: [CfRichTextDocumentComponent],
})
export class DefaultRichTextComponent {
  @Input() document: Document;
}
