import { Pipe, PipeTransform } from '@angular/core';
import { highlight, highlightAuto } from 'highlight.js';

@Pipe({
  name: 'highlightjs',
})
export class HighlightjsPipe implements PipeTransform {
  transform(code: string, language?: string): string {
    return language
      ? highlight(code, {
          language,
          ignoreIllegals: true,
        }).value
      : highlightAuto(code).value;
  }
}
