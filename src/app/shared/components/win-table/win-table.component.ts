import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnSetting } from './win-table.model';
import { CommonModule } from '@angular/common';
import { WinDynamicDirective } from './win-dynamic.directive';
import { WinDynamicPipe } from './win-dynamic.pipe';
import { WinNestedValuePipe } from './win-nested-value.pipe';
import { WinSafeHtmlPipe } from './win-safe-html.pipe';

@Component({
    selector: 'win-table',
    templateUrl: './win-table.component.html',
    styleUrls: ['./win-table.component.scss'],
    imports: [
        CommonModule,
        WinDynamicPipe,
        WinNestedValuePipe,
        WinDynamicDirective,
        WinSafeHtmlPipe,
    ],
    standalone: true,
})
export class WinTableComponent {
    @Input() columns!: ColumnSetting[];
    @Input() data!: any[];
    @Input() caption: string = '';
    @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();

    onRowClick(row: any, column: ColumnSetting) {
        if (column.clickEvent) {
            this.rowClick.emit(row);
        }
    }
}
