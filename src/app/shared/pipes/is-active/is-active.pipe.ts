import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isActive',
    standalone: true,
})
export class IsActivePipe implements PipeTransform {
    transform(value: boolean): string {
        return value ? 'Yes' : 'No';
    }
}
