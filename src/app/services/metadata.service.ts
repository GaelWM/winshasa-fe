import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Metadata, MetadataEntityType } from 'app/shared/models';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MetadataService extends BaseService {
    constructor() {
        super('metadata');
    }

    metadata$ = this.all<Metadata[]>({ perPage: 10000 });
    metadata = toWritableSignal(this.metadata$, {} as ApiResult<Metadata[]>);

    selectedMetadata: WritableSignal<ApiResult<Metadata>> = signal(
        {} as ApiResult<Metadata>
    );

    typeOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'type' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    statusOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    categoryOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    getComputedOptions = (type: string, entityType: MetadataEntityType) =>
        computed(() => {
            const metadata = this.metadata()?.data as Metadata[];
            return metadata
                ?.filter((t) => t.type === type && t.entity === entityType)
                .map((t) => ({
                    id: t.id,
                    name: t.value,
                }));
        });

    storeMetadata(payload: Metadata): Observable<ApiResult<Metadata>> {
        return this.post<Metadata>(payload).pipe(
            tap((result) => {
                this.metadata.update((metadata: ApiResult<Metadata[]>) => {
                    metadata.data = [
                        result.data as Metadata,
                        ...(metadata.data as Metadata[]),
                    ];
                    metadata.meta.total++;
                    return metadata;
                });
            })
        );
    }

    updateMetadata(
        id: string,
        payload: Metadata
    ): Observable<ApiResult<Metadata>> {
        return this.patch<Metadata>(id, payload).pipe(
            tap((result) => {
                this.metadata.update((metadata: ApiResult<Metadata[]>) => {
                    metadata.data = (metadata.data as Metadata[]).map(
                        (t: Metadata) =>
                            t.id === (result.data as Metadata)?.id
                                ? result.data
                                : t
                    ) as Metadata[];
                    return metadata;
                });
            })
        );
    }

    deleteMetadata(id: string): Observable<ApiResult<Metadata>> {
        return this.delete<Metadata>(id).pipe(
            tap(() => {
                this.metadata.update((metadata: ApiResult<Metadata[]>) => {
                    metadata.data = (metadata.data as Metadata[]).filter(
                        (t: Metadata) => t.id !== id
                    );
                    metadata.meta.total--;
                    return metadata;
                });
            })
        );
    }
}
