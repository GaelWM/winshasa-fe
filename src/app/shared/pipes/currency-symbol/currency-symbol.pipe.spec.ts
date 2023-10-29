import { Currency } from 'app/shared/models';
import { CurrencySymbolPipe } from './currency-symbol.pipe';

describe('CurrencySymbolPipe', () => {
    it('create an instance', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe).toBeTruthy();
    });

    it('should return €', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform(Currency.EUR)).toBe('€');
    });

    it('should return $', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform(Currency.USD)).toBe('$');
    });

    it('should return £', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform(Currency.GBP)).toBe('£');
    });

    it('should return R', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform(Currency.ZAR)).toBe('R');
    });

    it('should return FC', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform(Currency.CDF)).toBe('FC');
    });

    it('should return Ksh', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform(Currency.KES)).toBe('Ksh');
    });

    it('should return empty string', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform('' as Currency)).toBe('');
    });

    it('should return empty string', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform('' as Currency)).toBe('');
    });

    it('should return empty string', () => {
        const pipe = new CurrencySymbolPipe();
        expect(pipe.transform(null)).toBe('');
    });
});
