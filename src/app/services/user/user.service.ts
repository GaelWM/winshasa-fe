import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/services/user/user.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(protected _httpClient: HttpClient) {
        super('users', _httpClient);
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
    get(): Observable<User> {
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
        return this.modify(user.id, user).pipe(
            map((response) => this._user.next(response))
        );
    }
}
