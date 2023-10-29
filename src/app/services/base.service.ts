import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiResult } from 'app/shared/models/app.model';

import { environment } from 'environments/environment';
import {
    BehaviorSubject,
    Observable,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
} from 'rxjs';

const baseUrl = environment.apiBaseUrl;

@Injectable({
    providedIn: 'root',
})
export class BaseService {
    apiUrl: string;
    protected resource: string = '';
    perPage = 10;
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);

    searchSubject = new BehaviorSubject<string | undefined>(undefined);
    private searchQuery$ = this.searchSubject
        .asObservable()
        .pipe(debounceTime(300), distinctUntilChanged());

    private queries$: Observable<Params> = combineLatest([
        this.route.queryParams,
        this.searchQuery$,
    ]).pipe(
        takeUntilDestroyed(),
        map(([params, searchQuery]) => {
            const page = params.page;
            const limit = params.limit;
            const perPage = params.perPage;
            const orderBy = params.orderBy;
            const groupBy = params.groupBy;
            const search = searchQuery;
            return {
                ...(page && !search && { page: page }),
                ...(limit && !search && { limit: limit }),
                ...(!perPage && !search
                    ? { perPage: this.perPage }
                    : { perPage: perPage }),
                ...(search && { name: search }),
                ...(orderBy && !search && { orderBy: orderBy }),
                ...(groupBy && !search && { groupBy: groupBy }),
            };
        })
    );
    queries = toSignal(this.queries$, {} as Params);

    params$ = this.route.params;

    constructor(resource: string) {
        if (!resource) throw new Error('Resource is not provided');
        this.resource = resource;
        this.apiUrl = `${baseUrl}${this.resource}`;
    }

    updateResource(resource: string) {
        this.resource = resource;
        this.apiUrl = `${baseUrl}${this.resource}`;
    }

    all<T>(params?: any): Observable<ApiResult<T>> {
        return this.http.get<ApiResult<T>>(`${this.apiUrl}`, {
            ...(params && { params }),
        });
    }

    get<T>(id: string, params?: any): Observable<ApiResult<T>> {
        return this.http.get<ApiResult<T>>(`${this.apiUrl}/${id}`, {
            ...(params && { params }),
        });
    }

    post<T>(body: any, params?: any, headers?: any): Observable<ApiResult<T>> {
        return this.http.post<ApiResult<T>>(`${this.apiUrl}`, body, {
            ...(params && { params: params }),
            ...(headers && { headers: headers }),
        });
    }

    put<T>(id: string, body: any, params?: any): Observable<ApiResult<T>> {
        return this.http.put<ApiResult<T>>(
            `${this.apiUrl}/${id}`,
            { ...body },
            { ...(params && { params }) }
        );
    }

    patch<T>(id: string, body: any, params?: any): Observable<ApiResult<T>> {
        return this.http.patch<ApiResult<T>>(
            `${this.apiUrl}/${id}/patch`,
            { ...body },
            { ...(params && { params }) }
        );
    }

    delete<T>(id: string, params?: any): Observable<ApiResult<T>> {
        return this.http.delete<ApiResult<T>>(`${this.apiUrl}/${id}`, {
            ...(params && { params }),
        });
    }
}
