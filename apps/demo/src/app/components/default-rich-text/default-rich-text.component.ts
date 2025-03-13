import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Document } from '@contentful/rich-text-types';
import { CfRichTextDocumentComponent } from '@flowup/contentful-rich-text-angular-renderer';

@Component({
  selector: 'demo-default-rich-text',
  templateUrl: './default-rich-text.component.html',
  styleUrls: ['./default-rich-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfRichTextDocumentComponent],
})
export class DefaultRichTextComponent {
  @Input({ required: true }) document!: Document;
}
