import { Pipe, PipeTransform } from '@angular/core';
import highlight from "highlight.js"

@Pipe({
  name: 'highlightjs',
})
export class HighlightjsPipe implements PipeTransform {
  transform(code: string, language?: string): string {
    return language
      ? highlight.highlight(code, {
          language,
          ignoreIllegals: true,
        }).value
      : highlight.highlightAuto(code).value;
  }
}
