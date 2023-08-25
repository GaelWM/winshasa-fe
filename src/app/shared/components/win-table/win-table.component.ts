import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ColumnSetting } from './win-table.model';
import { CommonModule } from '@angular/common';
import { WinDynamicDirective } from './win-dynamic.directive';
import { WinDynamicPipe } from './win-dynamic.pipe';
import { WinNestedValuePipe } from './win-nested-value.pipe';
import { WinSafeHtmlPipe } from './win-safe-html.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

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
        MatIconModule,
        MatButtonModule,
    ],
    standalone: true,
})
export class WinTableComponent {
    private _route = inject(ActivatedRoute);
    private _columns: ColumnSetting[] = [];

    @Input() data!: any[];
    @Input() caption: string = '';
    @Input() allowSort: boolean = false;
    @Input() serverSideSorting: boolean = false;

    @Input() set columns(value: ColumnSetting[]) {
        const queries = this._route.snapshot.queryParams;
        if (queries.sortBy && queries.sortOrder) {
            const column = value.find((c) => c.sortKey === queries.sortBy);
            if (column) {
                column.sortOrder = queries.sortOrder;
            }
        }
        this._columns = value;
    }

    get columns(): ColumnSetting[] {
        return this._columns;
    }

    @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() sort: EventEmitter<ColumnSetting> = new EventEmitter<any>();

    onRowClick(row: any, column: ColumnSetting) {
        if (column.clickEvent) {
            this.rowClick.emit(row);
        }
    }

    onSort(column: ColumnSetting): void {
        column.sortOrder = column.sortOrder === 'asc' ? 'desc' : 'asc';
        if (this.serverSideSorting) {
            this.sort.emit(column);
        } else {
            if (column.sortKey) {
                this.data = this.data.sort((a: any, b: any) => {
                    if (column.sortOrder === 'asc') {
                        return a[column.sortKey] > b[column.sortKey] ? 1 : -1;
                    } else {
                        return a[column.sortKey] < b[column.sortKey] ? 1 : -1;
                    }
                });
            }
        }
    }
}
