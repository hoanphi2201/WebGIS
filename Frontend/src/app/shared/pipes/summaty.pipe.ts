import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {
  transform(value: string, maxLength: number = 150): string {
    if (value) {
      return value.length > maxLength ? value.substring(0, maxLength) + ' ...' : value;
    }
    return value;
  }
}
