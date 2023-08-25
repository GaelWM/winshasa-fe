import { Injectable } from '@angular/core';
import { BaseService } from 'app/services/base.service';

@Injectable({
    providedIn: 'root',
})
export class SearchService extends BaseService {
    constructor() {
        super('search');
    }
}
