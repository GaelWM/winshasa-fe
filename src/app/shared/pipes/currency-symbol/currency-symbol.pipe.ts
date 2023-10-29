import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from 'app/shared/models';

@Pipe({
    name: 'currencySymbol',
    standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
    transform(currency: Currency): string {
        switch (currency) {
            case Currency.EUR:
                return '€';
            case Currency.USD:
                return '$';
            case Currency.GBP:
                return '£';
            case Currency.ZAR:
                return 'R';
            case Currency.CDF:
                return 'FC';
            case Currency.KES:
                return 'Ksh';
            default:
                return '';
        }
    }
}
