import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateHelper',
    standalone: true,
})
export class DateHelperPipe implements PipeTransform {
    transform(value: string | number | Date, format = 'mediumDate'): string {
        return formatDate(value, format, 'en');
    }
}
