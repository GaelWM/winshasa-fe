import {
    DestroyRef,
    Injectable,
    WritableSignal,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Permission, User } from 'app/shared/models';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserService } from './user.service';
import {
    TOAST_STATE,
    ToastService,
} from 'app/shared/components/toast/toast.service';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService extends BaseService {
    #userService = inject(UserService);
    #toastService = inject(ToastService);
    #destroyRef = inject(DestroyRef);

    user = toSignal(this.#userService.user$, { initialValue: {} as User });

    constructor() {
        super('permissions');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitPermissionForm$: Observable<any> =
        this._submitted.asObservable();

    #permissions$ = this.all<Permission[]>({ perPage: 100 });
    $permissions = toWritableSignal(
        this.#permissions$,
        {} as ApiResult<Permission[]>
    );

    selectedPermission: WritableSignal<ApiResult<Permission>> = signal(
        {} as ApiResult<Permission>
    );

    hasPermission(
        requiredPermission: string | string[],
        message?: string
    ): boolean {
        let loggedInUser;
        this.#userService.user$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((user) => {
                loggedInUser = user;
            });

        console.log('loggedInUser: ', loggedInUser);
        const permissions = loggedInUser.permissions.map((perm) => perm.name);

        if (!loggedInUser) {
            return false;
        }

        if (typeof requiredPermission === 'string') {
            if (permissions.includes(requiredPermission)) {
                return true;
            }
        }

        if (Array.isArray(requiredPermission)) {
            if (requiredPermission.some((perm) => permissions.includes(perm))) {
                return true;
            }
        }

        this.#toastService.showToast(
            TOAST_STATE.WARNING,
            message ?? 'You do not have permission to access this page'
        );

        return false;
    }

    onPermissionFormSubmit(): Observable<boolean> {
        return this.onSubmitPermissionForm$;
    }

    submitPermissionForm(flag: boolean): void {
        this._submitted.next(flag);
    }

    storePermission(payload: Permission): Observable<ApiResult<Permission>> {
        return this.post<Permission>(payload).pipe(
            tap((result) => {
                this.$permissions.update(
                    (permissions: ApiResult<Permission[]>) => {
                        permissions.data = [
                            result.data as Permission,
                            ...(permissions.data as Permission[]),
                        ];
                        permissions.meta.total++;
                        return permissions;
                    }
                );
            })
        );
    }

    updatePermission(
        id: string,
        payload: Permission
    ): Observable<ApiResult<Permission>> {
        return this.patch<Permission>(id, payload).pipe(
            tap((result) => {
                this.selectedPermission.set(result);
            })
        );
    }

    deletePermission(id: string): Observable<ApiResult<Permission>> {
        return this.delete<Permission>(id).pipe(
            tap(() => {
                this.$permissions.update(
                    (permissions: ApiResult<Permission[]>) => {
                        permissions.data = (
                            permissions.data as Permission[]
                        ).filter((t: Permission) => t.id !== id);
                        permissions.meta.total--;
                        return permissions;
                    }
                );
            })
        );
    }
}
