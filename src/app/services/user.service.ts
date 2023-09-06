import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { BaseService } from './base.service';
import { User } from 'app/shared/models';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _httpClient = inject(HttpClient);

    constructor() {
        super('users');
    }

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    /**
     * Get the current logged in user data
     */
    me(): Observable<User> {
        return this._httpClient.get<User>(`${this.apiUrl}/me`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this.patch<User>(user.id, user).pipe(
            map((response) => {
                this._user.next(response.data as User);
            })
        );
    }

    /**
     * Update the user settings
     *
     * @param user
     */
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

    /**
     * Update the user profile pic
     *
     * @param user
     */
    updateProfilePic(formData: any): Observable<any> {
        return this.user$.pipe(
            switchMap((user) =>
                this._httpClient.post<any>(
                    `${this.apiUrl}/${user.id}/update-profile`,
                    formData,
                    { reportProgress: true, observe: 'events' }
                )
            )
        );
    }
}
