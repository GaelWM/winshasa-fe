import {
    HttpRequest,
    HttpErrorResponse,
    HttpHandlerFn,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export function ForbiddenInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) {
    const router = inject(Router);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
                router.navigate(['/forbidden']);
            }
            if (error.status === 404) {
                router.navigate(['/not-found']);
            }
            if (error.status === 500) {
                router.navigate(['/error']);
            }
            return throwError(() => error);
        })
    );
}
