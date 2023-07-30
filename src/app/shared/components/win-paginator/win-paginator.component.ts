import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

interface PaginationMeta {
    total: number;
    per_page: number;
    current_page: number;
    pageSizeOptions?: number[];
}
@Component({
    selector: 'win-paginator',
    standalone: true,
    imports: [CommonModule, MatPaginatorModule],
    templateUrl: './win-paginator.component.html',
    styleUrls: ['./win-paginator.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WinPaginatorComponent {
    @Input() pageSizeOptions: number[] = [5, 10, 15, 20, 25, 100];
    @Input() perPage: number = 10;
    @Input({ required: true }) meta: PaginationMeta;
    @Output() pageChange: EventEmitter<PageEvent> =
        new EventEmitter<PageEvent>();

    onPageChange(event: PageEvent): void {
        this.pageChange.emit(event);
    }
}
