import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Payment } from 'app/shared/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PaymentsService extends BaseService {
    constructor() {
        super('payments');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitPaymentForm$: Observable<any> =
        this._submitted.asObservable();

    payments: WritableSignal<ApiResult<Payment[]>> = signal(
        {} as ApiResult<Payment[]>
    );

    selectedPayment: WritableSignal<ApiResult<Payment>> = signal(
        {} as ApiResult<Payment>
    );

    storePayment(payload: Payment): Observable<ApiResult<Payment>> {
        return this.post<Payment>(payload).pipe(
            tap((result) => {
                this.payments.mutate((payments: ApiResult<Payment[]>) => {
                    payments.data = [
                        result.data as Payment,
                        ...(payments.data as Payment[]),
                    ];
                    payments.meta.total++;
                    return payments;
                });
            })
        );
    }

    updatePayment(
        id: string,
        payload: Payment
    ): Observable<ApiResult<Payment>> {
        return this.patch<Payment>(id, payload).pipe(
            tap((result) => {
                this.selectedPayment.set(result);
            })
        );
    }

    deletePayment(id: string): Observable<ApiResult<Payment>> {
        return this.delete<Payment>(id).pipe(
            tap(() => {
                this.payments.mutate((payments: ApiResult<Payment[]>) => {
                    payments.data = (payments.data as Payment[]).filter(
                        (t: Payment) => t.id !== id
                    );
                    payments.meta.total--;
                    return payments;
                });
            })
        );
    }
}
