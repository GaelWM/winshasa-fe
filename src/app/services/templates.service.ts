import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Template } from 'app/shared/models';
import { TemplateGroupField } from 'app/shared/models/template-group-field.model';
import { TemplateGroup } from 'app/shared/models/template-group.model';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TemplatesService extends BaseService {
    constructor() {
        super('templates');
    }

    templates: WritableSignal<ApiResult<Template[]>> = signal(
        {} as ApiResult<Template[]>
    );

    selectedTemplate: WritableSignal<ApiResult<Template>> = signal(
        {} as ApiResult<Template>
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

    createTemplateGroup(
        id: string,
        payload: TemplateGroup
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: [
                    ...template.details?.groups,
                    { ...payload, fields: [] },
                ],
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }

    updateTemplateGroup(
        id: string,
        payload: TemplateGroup
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: template.details?.groups?.map((g: TemplateGroup) =>
                    g.id === payload.id
                        ? {
                              ...g,
                              payload,
                          }
                        : g
                ),
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }

    updateTemplateGroupsOrder(
        id: string,
        payload: TemplateGroup[]
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: payload,
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }

    deleteTemplateGroup(
        id: string,
        groupId: string
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: template.details?.groups?.filter(
                    (g: TemplateGroup) => g.id !== groupId
                ),
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }

    createTemplateGroupField(
        id: string,
        groupId: string,
        payload: TemplateGroupField
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: template.details?.groups?.map((g: TemplateGroup) =>
                    g.id === groupId
                        ? {
                              ...g,
                              fields: [...g.fields, payload],
                          }
                        : g
                ),
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }

    updateTemplateGroupField(
        id: string,
        groupId: string,
        payload: TemplateGroupField
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: template.details?.groups?.map((g: TemplateGroup) =>
                    g.id === groupId
                        ? {
                              ...g,
                              fields: g.fields.map((f: TemplateGroupField) =>
                                  f.id === payload.id ? payload : f
                              ),
                          }
                        : g
                ),
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }

    deleteTemplateGroupField(
        id: string,
        groupId: string,
        fieldId: string
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: template.details?.groups?.map((g: TemplateGroup) =>
                    g.id === groupId
                        ? {
                              ...g,
                              fields: g.fields.filter(
                                  (f: TemplateGroupField) => f.id !== fieldId
                              ),
                          }
                        : g
                ),
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }

    updateTemplateGroupFieldsOrder(
        id: string,
        groupId: string,
        payload: TemplateGroupField[]
    ): Observable<ApiResult<Template>> {
        const template = this.selectedTemplate().data as Template;
        const tempPayload = {
            ...template,
            details: {
                ...template.details,
                groups: template.details?.groups?.map((g: TemplateGroup) =>
                    g.id === groupId
                        ? {
                              ...g,
                              fields: payload,
                          }
                        : g
                ),
            },
        };
        return this.patch<Template>(id, tempPayload).pipe(
            tap((result) => {
                this.selectedTemplate.set(result);
            })
        );
    }
}
