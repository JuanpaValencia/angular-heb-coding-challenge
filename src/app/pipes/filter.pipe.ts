import { Pipe, PipeTransform } from '@angular/core';
import { PizzaParams } from '../models/pizza-list.params';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipe implements PipeTransform {

  // pipe to filter by pizza flavor
  transform(items: PizzaParams[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(order => {
      return order.Flavor.toLocaleLowerCase().includes(searchText);
    });
  }

}
