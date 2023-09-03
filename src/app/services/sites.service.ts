import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Site } from 'app/shared/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SitesService extends BaseService {
    constructor() {
        super('sites');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitSiteForm$: Observable<any> = this._submitted.asObservable();

    sites: WritableSignal<ApiResult<Site[]>> = signal({} as ApiResult<Site[]>);

    selectedSite: WritableSignal<ApiResult<Site>> = signal(
        {} as ApiResult<Site>
    );

    onSiteFormSubmit(): Observable<boolean> {
        return this.onSubmitSiteForm$;
    }

    submitSiteForm(): void {
        this._submitted.next(true);
    }

    storeSite(payload: Site): Observable<ApiResult<Site>> {
        return this.post<Site>(payload).pipe(
            tap((result) => {
                this.sites.mutate((sites: ApiResult<Site[]>) => {
                    sites.data = [
                        result.data as Site,
                        ...(sites.data as Site[]),
                    ];
                    sites.meta.total++;
                    return sites;
                });
            })
        );
    }

    updateSite(id: string, payload: Site): Observable<ApiResult<Site>> {
        return this.patch<Site>(id, payload).pipe(
            tap((result) => {
                this.selectedSite.set(result);
            })
        );
    }

    deleteSite(id: string): Observable<ApiResult<Site>> {
        return this.delete<Site>(id).pipe(
            tap(() => {
                this.sites.mutate((sites: ApiResult<Site[]>) => {
                    sites.data = (sites.data as Site[]).filter(
                        (t: Site) => t.id !== id
                    );
                    sites.meta.total--;
                    return sites;
                });
            })
        );
    }
}
