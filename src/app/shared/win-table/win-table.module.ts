import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WinDynamicDirective } from './win-dynamic.directive';
import { WinDynamicPipe } from './win-dynamic.pipe';
import { WinNestedValuePipe } from './win-nested-value.pipe';
import { WinSafeHtmlPipe } from './win-safe-html.pipe';
import { WinTableComponent } from './win-table.component';

@NgModule({
    imports: [CommonModule],
    exports: [
        WinTableComponent,
        WinDynamicPipe,
        WinNestedValuePipe,
        WinDynamicDirective,
        WinSafeHtmlPipe,
    ],
    declarations: [
        WinTableComponent,
        WinDynamicPipe,
        WinNestedValuePipe,
        WinDynamicDirective,
        WinSafeHtmlPipe,
    ],
    providers: [],
})
export class WinTableModule {}
