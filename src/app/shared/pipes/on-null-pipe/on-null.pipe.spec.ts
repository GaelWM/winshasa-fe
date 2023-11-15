import { OnNullPipe } from './on-null.pipe';

describe('OnNullPipe', () => {
    it('create an instance', () => {
        const pipe = new OnNullPipe();
        expect(pipe).toBeTruthy();
    });

    it('should return -- if value is null', () => {
        const pipe = new OnNullPipe();
        expect(pipe.transform(null)).toEqual('--');
    });

    it('should return -- if value is undefined', () => {
        const pipe = new OnNullPipe();
        expect(pipe.transform(undefined)).toEqual('--');
    });

    it('should return -- if value is empty string', () => {
        const pipe = new OnNullPipe();
        expect(pipe.transform('')).toEqual('');
    });

    it('should return number if value is number', () => {
        const pipe = new OnNullPipe();
        expect(pipe.transform(1)).toEqual(1);
    });

    it('should return string if value is string', () => {
        const pipe = new OnNullPipe();
        expect(pipe.transform('1')).toEqual('1');
    });
});
