import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'winNestedValue',
    standalone: true,
})
export class WinNestedValuePipe implements PipeTransform {
    transform(value: any, key: string | string[] | undefined): string {
        if (value && key) {
            return key.constructor === Array
                ? this.transformArray(value, key as string[])
                : this.transformPlain(value, key as string);
        } else {
            return '';
        }
    }

    transformPlain(value: any, key: string): string {
        const keys = key?.split('.');
        keys?.forEach((_key: string) => {
            value = value && value[_key];
        });
        return value;
    }

    transformArray(value: any, keys: string[]): string {
        let toReturn = '';
        keys.forEach((key, index) => {
            toReturn +=
                this.transformPlain(value, key) +
                (index < keys.length - 1 ? ';' : '');
        });
        return toReturn;
    }
}
