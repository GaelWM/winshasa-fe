import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Role } from 'app/shared/models';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RolesService extends BaseService {
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

    storeRole(payload: Role): Observable<ApiResult<Role>> {
        return this.post<Role>(payload).pipe(
            tap((result) => {
                this.$roles.mutate((roles: ApiResult<Role[]>) => {
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
                this.$roles.mutate((roles: ApiResult<Role[]>) => {
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