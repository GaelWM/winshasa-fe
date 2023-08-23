import { Injectable, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Template } from 'app/shared/models';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TemplatesService extends BaseService {
    private queryParams$ = toObservable(this.queries);

    constructor() {
        super('templates');
    }

    templates$ = this.queryParams$.pipe(
        switchMap((params) => this.all<Template[]>(params)),
        takeUntilDestroyed()
    );
    templates: WritableSignal<ApiResult<Template[]>> = toWritableSignal(
        this.templates$,
        {} as ApiResult<Template[]>
    );

    storeTemplate(payload: Template): Observable<ApiResult<Template>> {
        return this.post<Template>(payload).pipe(
            tap((result) => {
                this.templates.mutate((templates: ApiResult<Template[]>) => {
                    templates.data = [
                        result.data as Template,
                        ...(templates.data as Template[]),
                    ];
                    templates.meta.total++;
                    return templates;
                });
            })
        );
    }

    updateTemplate(
        id: string,
        payload: Template
    ): Observable<ApiResult<Template>> {
        return this.patch<Template>(id, payload).pipe(
            tap((result) => {
                this.templates.mutate((templates: ApiResult<Template[]>) => {
                    templates.data = (templates.data as Template[]).map(
                        (t: Template) =>
                            t.id === (result.data as Template)?.id
                                ? result.data
                                : t
                    ) as Template[];
                    return templates;
                });
            })
        );
    }

    deleteTemplate(id: string): Observable<ApiResult<Template>> {
        return this.delete<Template>(id).pipe(
            tap(() => {
                this.templates.mutate((templates: ApiResult<Template[]>) => {
                    templates.data = (templates.data as Template[]).filter(
                        (t: Template) => t.id !== id
                    );
                    templates.meta.total--;
                    return templates;
                });
            })
        );
    }
}
