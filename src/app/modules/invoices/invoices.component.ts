import {
    Component,
    DestroyRef,
    TemplateRef,
    ViewChild,
    effect,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'app/shared/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColumnSetting } from 'app/shared/components/win-table/win-table.model';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { InvoicesService } from '../../services/invoices.service';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { ApiResult, IInvoice, Invoice, User } from 'app/shared/models';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { Observable, distinctUntilChanged, map, switchMap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateHelperPipe } from 'app/shared/pipes/date-helper-pipe/date-helper.pipe';

@Component({
    selector: 'app-invoice',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarComponent,
        MatButtonModule,
        MatIconModule,
        WinTableComponent,
        WinPaginatorComponent,
        IsActivePipe,
        MatTooltipModule,
    ],
    templateUrl: './invoices.component.html',
})
export class InvoicesComponent {
    #userService = inject(UserService);
    #invoicesService = inject(InvoicesService);
    #router = inject(Router);
    #route = inject(ActivatedRoute);
    #fuseConfirmationService = inject(FuseConfirmationService);
    #destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    #invoices$: Observable<ApiResult<Invoice[]>> = toObservable(
        this.#invoicesService.queries
    ).pipe(
        distinctUntilChanged(),
        switchMap((params) => this.#invoicesService.all<Invoice[]>(params)),
        map((result: ApiResult<Invoice[]>) => {
            if (result.data) {
                this.#invoicesService.invoices.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    $invoices = toSignal(this.#invoices$);

    columns: ColumnSetting[] = [];
    user = toSignal(this.#userService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
                {
                    title: 'Invoice Number',
                    key: 'invoiceNumber',
                    clickEvent: true,
                    sortKey: 'invoiceNumber',
                },
                {
                    title: 'Invoice Date',
                    key: 'invoiceDate',
                    clickEvent: true,
                    sortKey: 'invoiceDate',
                    pipe: { class: { obj: DateHelperPipe } },
                },
                {
                    title: 'Due Date',
                    key: 'dueDate',
                    clickEvent: true,
                    sortKey: 'dueDate',
                    pipe: { class: { obj: DateHelperPipe } },
                },
                {
                    title: 'Invoice Status',
                    key: 'invoiceStatus',
                    clickEvent: true,
                    sortKey: 'invoiceStatus',
                },
                {
                    title: 'Customer Name',
                    key: 'customerName',
                    clickEvent: true,
                    sortKey: 'customerName',
                },
                {
                    title: 'Total Amount',
                    key: 'totalAmount',
                    clickEvent: true,
                    sortKey: 'totalAmount',
                },

                {
                    title: 'Tax Amount',
                    key: 'taxAmount',
                    clickEvent: true,
                    sortKey: 'taxAmount',
                },
                {
                    title: 'Discount Amount',
                    key: 'discountAmount',
                    clickEvent: true,
                    sortKey: 'discountAmount',
                },
                {
                    title: 'Created At',
                    key: 'createdAt',
                    clickEvent: true,
                    sortKey: 'createdAt',
                },
                {
                    title: 'Updated At',
                    key: 'updatedAt',
                    clickEvent: true,
                    sortKey: 'updatedAt',
                },
                { title: 'Actions', key: 'action', template: this.actionsTpl },
            ];
        });
    }

    onPageChange(event: PageEvent) {
        this.#router.navigate([], {
            queryParams: {
                page: event.pageIndex + 1,
                perPage: event.pageSize,
            },
            queryParamsHandling: 'merge',
        });
    }

    onSort(event: ColumnSetting): void {
        this.#router.navigate([], {
            queryParams: { orderBy: `${event.sortKey}:${event.sortOrder}` },
            queryParamsHandling: 'merge',
            relativeTo: this.#route,
        });
    }

    onRowClick(invoice: Invoice): void {
        this.#invoicesService.selectedInvoice.set({ data: invoice });
        this.#router.navigate(['invoices', invoice.id, 'general-details']);
    }

    onEditInvoice(event: Event, invoice: Invoice) {
        event.preventDefault();
        event.stopPropagation();
        this.#invoicesService.selectedInvoice.set({ data: invoice });
        this.#router.navigate(['invoices', invoice.id, 'general-details']);
    }

    onDeleteInvoice(event: Event, invoice: IInvoice) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this.#fuseConfirmationService.open({
            title: 'Delete invoice',
            message:
                'Are you sure you want to delete this invoice? This action cannot be undone.',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.#invoicesService
                    .deleteInvoice(invoice.id)
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe();
            }
        });
    }
}
