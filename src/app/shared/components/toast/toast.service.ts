import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum TOAST_STATE {
    PRIMARY = 'primary',
    ACCENT = 'accent',
    WARN = 'warn',
    BASIC = 'basic',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    public showsToast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    public toastTitle$: BehaviorSubject<string> = new BehaviorSubject<string>(
        'Success!'
    );
    public toastMessage$: BehaviorSubject<string> = new BehaviorSubject<string>(
        'Default Toast Message'
    );
    public toastState$: BehaviorSubject<string> = new BehaviorSubject<string>(
        TOAST_STATE.SUCCESS
    );

    constructor() {}

    showToast(toastState: string, toastMsg: string, title?: string): void {
        // Observables use '.next()' to indicate what they want done with observable
        // This will update the toastState to the toastState passed into the function
        this.toastState$.next(toastState);

        this.toastTitle$.next(title);

        // This updates the toastMessage to the toastMsg passed into the function
        this.toastMessage$.next(toastMsg);

        // This will update the showsToast trigger to 'true'
        this.showsToast$.next(true);
    }

    // This updates the showsToast behavior subject to 'false'
    dismissToast(): void {
        this.showsToast$.next(false);
    }
}
