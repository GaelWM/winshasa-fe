import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnSetting } from './win-table.model';

@Component({
    selector: 'win-table',
    templateUrl: './win-table.component.html',
    styleUrls: ['./win-table.component.scss'],
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
