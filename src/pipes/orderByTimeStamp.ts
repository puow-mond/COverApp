import { Pipe } from '@angular/core';

@Pipe({ name: 'order-by' })
export class OrderByPipe {
    transform(array, args) {
        return array.sortBy(array, args);
    }
}