import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { UserService } from 'app/services/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    constructor() {
        super('auth');
    }

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/forgot-password`, {
            email,
        });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(
        token: string,
        password: string,
        password_confirmation: string
    ): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/reset-password`, {
            token,
            password,
            password_confirmation,
        });
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            throw new Error('User is already logged in.');
        }

        return this._httpClient.post(`${this.apiUrl}/login`, credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/logout`, {}).pipe(
            switchMap((response: any) => {
                // Remove the access token from the local storage
                localStorage.removeItem('accessToken');

                // Set the authenticated flag to false
                this._authenticated = false;

                // Return the observable
                return of(true);
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        return this._httpClient.get(`${this.apiUrl}/check-auth`).pipe(
            switchMap((response: any) => {
                this._authenticated = response.authenticated;

                if (!this._authenticated) {
                    localStorage.removeItem('accessToken');
                }

                if (this._authenticated) {
                    this._userService.user = response.user;
                }

                return of(this._authenticated);
            }),
            catchError((error) => {
                localStorage.removeItem('accessToken');

                // Set the authenticated flag to false
                this._authenticated = false;

                // Return a new observable with the response
                return of(false);
            })
        );
    }
}
