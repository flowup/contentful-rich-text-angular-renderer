import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CfRichTextModule } from '@contentful-rich-text-angular-renderer/contentful-rich-text-angular-renderer';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { AppComponent } from './app.component';
import { CustomRichTextComponent } from './components/custom-rich-text/custom-rich-text.component';
import { DefaultRichTextComponent } from './components/default-rich-text/default-rich-text.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultRichTextComponent,
    CustomRichTextComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgJsonEditorModule,
    CfRichTextModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
