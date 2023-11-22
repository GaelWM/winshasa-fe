import { CommonModule } from '@angular/common';
import {
    Component,
    ViewEncapsulation,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiResult, Invoice } from 'app/shared/models';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { InvoicesService } from 'app/services/invoices.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
        MatButtonModule,
        RouterModule,
    ],

    standalone: true,
})
export class InvoiceComponent {
    #invoiceService = inject(InvoicesService);
    #route = inject(ActivatedRoute);

    background: ThemePalette = 'accent';

    private invoice$: Observable<ApiResult<Invoice>> = this.#route.params.pipe(
        switchMap((params) => this.#invoiceService.get<Invoice>(params['id'])),
        tap((invoice: ApiResult<Invoice>) => {
            if (invoice) {
                this.#invoiceService.selectedInvoice.set(invoice);
            }
        }),
        catchError(() => of(undefined)),
        takeUntilDestroyed()
    );
    invoiceTemp = toSignal(this.invoice$, {
        initialValue: {} as ApiResult<Invoice>,
    });

    $invoice = signal({} as ApiResult<Invoice>);

    constructor() {
        effect(() => {
            this.invoiceTemp();
            this.$invoice = this.#invoiceService.selectedInvoice;
        });
    }
}
