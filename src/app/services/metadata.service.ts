import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Metadata } from 'app/shared/models';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MetadataService extends BaseService {
    constructor() {
        super('metadata');
    }

    metadata: WritableSignal<ApiResult<Metadata[]>> = signal(
        {} as ApiResult<Metadata[]>
    );

    selectedMetadata: WritableSignal<ApiResult<Metadata>> = signal(
        {} as ApiResult<Metadata>
    );

    storeMetadata(payload: Metadata): Observable<ApiResult<Metadata>> {
        return this.post<Metadata>(payload).pipe(
            tap((result) => {
                this.metadata.mutate((metadata: ApiResult<Metadata[]>) => {
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
                this.metadata.mutate((metadata: ApiResult<Metadata[]>) => {
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
                this.metadata.mutate((metadata: ApiResult<Metadata[]>) => {
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
