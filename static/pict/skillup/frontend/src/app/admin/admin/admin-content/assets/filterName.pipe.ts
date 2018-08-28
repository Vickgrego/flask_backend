import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterName'})
export class FilterNamePipe implements PipeTransform {
  transform(tags: any, name: string): number {
    let result = tags;

    if (name && name !== "") {
      result = tags.filter((item) => {
        if (item.name) {
          return item.name.toString().toLowerCase().indexOf(name.toString().toLowerCase()) >= 0
        }
      });
    }

    return result;
  }
}
