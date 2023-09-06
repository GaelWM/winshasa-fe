import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class UploadService extends BaseService {
    constructor() {
        super('upload');
    }

    upload(formData: FormData): Observable<any> {
        return this.post<any>(formData, {
            reportProgress: true,
            observe: 'events',
        });
    }
}
