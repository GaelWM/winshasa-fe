import { Pipe, PipeTransform } from '@angular/core';
import { DynamicPipeModel } from './win-table.model';

@Pipe({
    name: 'winDynamicPipe',
})
export class WinDynamicPipe implements PipeTransform {
    transform(
        value: any,
        pipeClass: DynamicPipeModel,
        ...args: any[]
    ): unknown {
        const pipe = new pipeClass.obj(pipeClass.constructor);
        return pipe.transform(value, ...args);
    }
}
