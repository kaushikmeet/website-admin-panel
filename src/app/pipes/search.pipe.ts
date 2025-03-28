import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, key?: string): any[] {

    if (!items || !searchTerm) {
      return items;
    }
    
    searchTerm = searchTerm.toLowerCase();
     return items.filter(item=>{
      if(key){
        return item[key].toString().toLowerCase().includes(searchTerm);
      }else{
        return JSON.stringify(item).toLowerCase().includes(searchTerm)
      }
     })

    }
  }
