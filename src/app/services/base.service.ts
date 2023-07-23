import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3333/api';

@Injectable({
    providedIn: 'root',
})
export class BaseService {
    resource: string;
    apiUrl: string;

    constructor(resource: string, protected _httpClient: HttpClient) {
        if (!resource) throw new Error('Resource is not provided');
        this.resource = resource;
        this.apiUrl = `${API_URL}/${this.resource}`;
    }

    public all<T>(): Observable<T> {
        return this._httpClient.get<T>(`${API_URL}/${this.resource}`);
    }

    public getById<T>(id: string): Observable<T> {
        return this._httpClient.get<T>(`${API_URL}/${this.resource}/${id}`);
    }

    public store<T>(entity: T): Observable<T> {
        return this._httpClient.post<T>(`${API_URL}/${this.resource}`, entity);
    }

    public modify<T>(id: string, entity: T): Observable<T> {
        return this._httpClient.patch<T>(
            `${API_URL}/${this.resource}/${id}`,
            entity
        );
    }

    public destroy<T>(id: string): Observable<T> {
        return this._httpClient.delete<T>(`${API_URL}/${this.resource}/${id}`);
    }
}
