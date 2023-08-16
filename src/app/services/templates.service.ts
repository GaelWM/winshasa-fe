import {
    DestroyRef,
    Injectable,
    WritableSignal,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Template } from 'app/shared/models';
import { switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TemplatesService extends BaseService {
    private destroyRef = inject(DestroyRef);
    private queryParams$ = toObservable(this.queries);

    constructor() {
        super('templates');
        effect(() => this.getTemplates());
    }

    templates: WritableSignal<ApiResult<Template[]>> = signal(
        {} as ApiResult<Template[]>
    );

    getTemplates(): void {
        this.queryParams$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params) => {
                    return this.all<Template[]>(params);
                })
            )
            .subscribe((templates) => {
                this.templates.set(templates);
            });
    }

    updateUponSave(template: Template): void {
        this.templates.mutate((templates: ApiResult<Template[]>) => {
            templates.data = (templates.data as Template[]).map((t: Template) =>
                t.id === template.id ? template : t
            );
            return templates;
        });
    }

    updateUponCreate(template: Template): void {
        this.templates.mutate((templates: ApiResult<Template[]>) => {
            templates.data = [...(templates.data as Template[]), template];
            templates.meta.total++;
            return templates;
        });
    }

    updateUponDelete(id: string): void {
        this.templates.mutate((templates: ApiResult<Template[]>) => {
            templates.data = (templates.data as Template[]).filter(
                (t: Template) => t.id !== id
            );
            templates.meta.total--;
            return templates;
        });
    }
}
