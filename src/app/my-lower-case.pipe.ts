import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myLowerCase',
})
export class MyLowerCasePipe implements PipeTransform {
  transform(value: string): string {
    if (value && typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  }
}
