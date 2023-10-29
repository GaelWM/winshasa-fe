import { DateHelperPipe } from './date-helper.pipe';

describe('DateHelperPipe', () => {
    it('create an instance', () => {
        const pipe = new DateHelperPipe();
        expect(pipe).toBeTruthy();
    });

    it('should return formatted date', () => {
        const pipe = new DateHelperPipe();
        expect(pipe.transform('2021-02-02T00:00:00.000Z')).toBe('Feb 2, 2021');
    });

    it('should return formatted date with custom format', () => {
        const pipe = new DateHelperPipe();
        expect(pipe.transform('2021-02-02T00:00:00.000Z', 'shortDate')).toBe(
            '2/2/21'
        );
    });

    it('should return formatted date with custom format and locale', () => {
        const pipe = new DateHelperPipe();
        expect(pipe.transform('2021-02-02T00:00:00.000Z', 'shortDate')).toBe(
            '02/02/2021'
        );
    });
});
