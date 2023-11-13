import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, LeaseAgreement } from 'app/shared/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LeaseAgreementsService extends BaseService {
    constructor() {
        super('lease-agreements');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitLeaseAgreementForm$: Observable<any> =
        this._submitted.asObservable();

    leaseAgreements: WritableSignal<ApiResult<LeaseAgreement[]>> = signal(
        {} as ApiResult<LeaseAgreement[]>
    );

    selectedLeaseAgreement: WritableSignal<ApiResult<LeaseAgreement>> = signal(
        {} as ApiResult<LeaseAgreement>
    );

    onLeaseAgreementFormSubmit(): Observable<boolean> {
        return this.onSubmitLeaseAgreementForm$;
    }

    submitLeaseAgreementForm(flag: boolean): void {
        this._submitted.next(flag);
    }

    storeLeaseAgreement(
        payload: LeaseAgreement
    ): Observable<ApiResult<LeaseAgreement>> {
        return this.post<LeaseAgreement>(payload).pipe(
            tap((result) => {
                this.leaseAgreements.update(
                    (leaseAgreements: ApiResult<LeaseAgreement[]>) => {
                        leaseAgreements.data = [
                            result.data as LeaseAgreement,
                            ...(leaseAgreements.data as LeaseAgreement[]),
                        ];
                        leaseAgreements.meta.total++;
                        return leaseAgreements;
                    }
                );
            })
        );
    }

    updateLeaseAgreement(
        id: string,
        payload: LeaseAgreement
    ): Observable<ApiResult<LeaseAgreement>> {
        return this.patch<LeaseAgreement>(id, payload).pipe(
            tap((result) => {
                this.selectedLeaseAgreement.set(result);
            })
        );
    }

    deleteLeaseAgreement(id: string): Observable<ApiResult<LeaseAgreement>> {
        return this.delete<LeaseAgreement>(id).pipe(
            tap(() => {
                this.leaseAgreements.update(
                    (leaseAgreements: ApiResult<LeaseAgreement[]>) => {
                        leaseAgreements.data = (
                            leaseAgreements.data as LeaseAgreement[]
                        ).filter((t: LeaseAgreement) => t.id !== id);
                        leaseAgreements.meta.total--;
                        return leaseAgreements;
                    }
                );
            })
        );
    }
}
