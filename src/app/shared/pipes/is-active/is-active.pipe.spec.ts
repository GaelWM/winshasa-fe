import { IsActivePipe } from './is-active.pipe';

describe('IsActivePipe', () => {
    it('create an instance', () => {
        const pipe = new IsActivePipe();
        expect(pipe).toBeTruthy();
    });

    it('should return Yes if value is true', () => {
        const pipe = new IsActivePipe();
        expect(pipe.transform(true)).toEqual('Yes');
    });

    it('should return No if value is false', () => {
        const pipe = new IsActivePipe();
        expect(pipe.transform(false)).toEqual('No');
    });
});
