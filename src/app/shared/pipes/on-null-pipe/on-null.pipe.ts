import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'onNull',
    standalone: true,
})
export class OnNullPipe implements PipeTransform {
    transform(value: string | number | null | undefined): string | number {
        return value === null || value === undefined ? '--' : value;
    }
}
