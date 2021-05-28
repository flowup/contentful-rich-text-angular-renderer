import { Pipe, PipeTransform } from '@angular/core';
import { highlight, highlightAuto } from 'highlight.js';

@Pipe({
  name: 'highlightjs',
})
export class HighlightjsPipe implements PipeTransform {
  transform(code: string, lang?: string): string {
    return lang ? highlight(lang, code).value : highlightAuto(code).value;
  }
}
