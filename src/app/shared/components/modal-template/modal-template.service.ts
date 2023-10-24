import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalTemplateService {
    #closeModal: Subject<void> = new Subject<void>();
    #closeModal$: Observable<void> = this.#closeModal.asObservable();

    closeModal(): void {
        this.#closeModal.next();
    }

    closeModal$(): Observable<void> {
        return this.#closeModal$;
    }
}
