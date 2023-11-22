import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Invoice } from 'app/shared/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InvoicesService extends BaseService {
    constructor() {
        super('invoices');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitInvoiceForm$: Observable<any> =
        this._submitted.asObservable();

    invoices: WritableSignal<ApiResult<Invoice[]>> = signal(
        {} as ApiResult<Invoice[]>
    );

    selectedInvoice: WritableSignal<ApiResult<Invoice>> = signal(
        {} as ApiResult<Invoice>
    );

    onInvoiceFormSubmit(): Observable<boolean> {
        return this.onSubmitInvoiceForm$;
    }

    submitInvoiceForm(flag: boolean): void {
        this._submitted.next(flag);
    }

    storeInvoice(payload: Invoice): Observable<ApiResult<Invoice>> {
        return this.post<Invoice>(payload).pipe(
            tap((result) => {
                this.invoices.update((invoices: ApiResult<Invoice[]>) => {
                    invoices.data = [
                        result.data as Invoice,
                        ...(invoices.data as Invoice[]),
                    ];
                    invoices.meta.total++;
                    return invoices;
                });
            })
        );
    }

    updateInvoice(
        id: string,
        payload: Invoice
    ): Observable<ApiResult<Invoice>> {
        return this.patch<Invoice>(id, payload).pipe(
            tap((result) => {
                this.selectedInvoice.set(result);
            })
        );
    }

    deleteInvoice(id: string): Observable<ApiResult<Invoice>> {
        return this.delete<Invoice>(id).pipe(
            tap(() => {
                this.invoices.update((invoices: ApiResult<Invoice[]>) => {
                    invoices.data = (invoices.data as Invoice[]).filter(
                        (t: Invoice) => t.id !== id
                    );
                    invoices.meta.total--;
                    return invoices;
                });
            })
        );
    }
}
