import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Role } from 'app/shared/models';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RolesService extends BaseService {
    #httpClient = inject(HttpClient);

    constructor() {
        super('roles');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitRoleForm$: Observable<any> = this._submitted.asObservable();

    #roles$ = this.all<Role[]>({ perPage: 100 });
    $roles = toWritableSignal(this.#roles$, {} as ApiResult<Role[]>);

    selectedRole: WritableSignal<ApiResult<Role>> = signal(
        {} as ApiResult<Role>
    );

    assignPermissions(roleId: string, permissions: string): Observable<any> {
        return this.#httpClient.post(
            `${this.apiUrl}/${roleId}/assign-permissions`,
            {
                permissions,
            }
        );
    }

    revokePermissions(roleId: string, permissions: string): Observable<any> {
        return this.#httpClient.post(
            `${this.apiUrl}/${roleId}/revoke-permissions`,
            {
                permissions,
            }
        );
    }

    storeRole(payload: Role): Observable<ApiResult<Role>> {
        return this.post<Role>(payload).pipe(
            tap((result) => {
                this.$roles.update((roles: ApiResult<Role[]>) => {
                    roles.data = [
                        result.data as Role,
                        ...(roles.data as Role[]),
                    ];
                    roles.meta.total++;
                    return roles;
                });
            })
        );
    }

    updateRole(id: string, payload: Role): Observable<ApiResult<Role>> {
        return this.patch<Role>(id, payload).pipe(
            tap((result) => {
                this.selectedRole.set(result);
            })
        );
    }

    deleteRole(id: string): Observable<ApiResult<Role>> {
        return this.delete<Role>(id).pipe(
            tap(() => {
                this.$roles.update((roles: ApiResult<Role[]>) => {
                    roles.data = (roles.data as Role[]).filter(
                        (t: Role) => t.id !== id
                    );
                    roles.meta.total--;
                    return roles;
                });
            })
        );
    }
}
