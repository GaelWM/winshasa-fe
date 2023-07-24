import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Template } from 'app/shared/models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TemplateService extends BaseService {
    constructor() {
        super('templates');
    }

    private templates$ = this.getTemplates(this.queries);
    templates = toSignal(this.templates$, {
        initialValue: [] as ApiResult<Template[]>,
    });

    getTemplates(params?: any): Observable<ApiResult<Template[]>> {
        return this.all<Template[]>(params);
    }
}
