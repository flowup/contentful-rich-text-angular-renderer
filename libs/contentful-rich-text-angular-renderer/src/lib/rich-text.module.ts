import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CfRichTextDocumentComponent } from './rich-text-document.component';
import { CfRichTextNodeDirective } from './rich-text-node.directive';
import { CfRichTextChildrenDirective } from './rich-text-children.directive';
import { CfRichTextMarkDirective } from './rich-text-mark.directive';

@NgModule({
  declarations: [
    CfRichTextDocumentComponent,
    CfRichTextNodeDirective,
    CfRichTextMarkDirective,
    CfRichTextChildrenDirective,
  ],
  imports: [CommonModule],
  exports: [
    CfRichTextDocumentComponent,
    CfRichTextNodeDirective,
    CfRichTextMarkDirective,
    CfRichTextChildrenDirective,
  ],
})
export class CfRichTextModule {}
