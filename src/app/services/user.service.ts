import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { BaseService } from './base.service';
import { ApiResult, User } from 'app/shared/models';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _httpClient = inject(HttpClient);

    constructor() {
        super('users');
    }

    set user(value: User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    users: WritableSignal<ApiResult<User[]>> = signal({} as ApiResult<User[]>);

    selectedUser: WritableSignal<ApiResult<User>> = signal(
        {} as ApiResult<User>
    );

    me(): Observable<User> {
        return this._httpClient.get<User>(`${this.apiUrl}/me`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    update(user: User): Observable<any> {
        return this.patch<User>(user.id, user).pipe(
            map((response) => {
                this._user.next(response.data as User);
            })
        );
    }

    updateSettings(settings: any): Observable<any> {
        return this.user$.pipe(
            switchMap((user) =>
                this._httpClient.patch<User>(user.id, {
                    ...user,
                    details: { ...user.details, settings },
                })
            ),
            tap((response) => {
                this._user.next(response.data as User);
            })
        );
    }

    updateProfilePic(formData: any): Observable<any> {
        return this.user$.pipe(
            switchMap((user) =>
                this.post<User>(
                    {
                        ...user,
                        ...formData,
                    },
                    {
                        reportProgress: true,
                        observe: 'events',
                    }
                )
            )
        );
    }

    storeUser(payload: User): Observable<ApiResult<User>> {
        return this.post<User>(payload).pipe(
            tap((result) => {
                this.users.mutate((users: ApiResult<User[]>) => {
                    users.data = [
                        result.data as User,
                        ...(users.data as User[]),
                    ];
                    users.meta.total++;
                    return users;
                });
            })
        );
    }

    updateUser(id: string, payload: User): Observable<ApiResult<User>> {
        return this.patch<User>(id, payload).pipe(
            tap((result) => {
                this.selectedUser.set(result);
                this.users.mutate((users: ApiResult<User[]>) => {
                    users.data = (users.data as User[]).map((user: User) => {
                        if (user.id === id) {
                            return result.data as User;
                        }
                        return user;
                    });
                    return users;
                });
            })
        );
    }

    deleteUser(id: string): Observable<ApiResult<User>> {
        return this.delete<User>(id).pipe(
            tap(() => {
                this.users.mutate((users: ApiResult<User[]>) => {
                    users.data = (users.data as User[]).filter(
                        (t: User) => t.id !== id
                    );
                    users.meta.total--;
                    return users;
                });
            })
        );
    }
}
