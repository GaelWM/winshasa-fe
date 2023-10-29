import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { PaymentsService } from 'app/services/payments.service';
import { PaymentsDetailsComponent } from 'app/shared/components/payments/details/details.component';
import { catchError, tap, throwError } from 'rxjs';
import { PaymentsComponent } from './payments.component';
import { PaymentsListComponent } from 'app/shared/components/payments/list/list.component';
import { Payment } from 'app/shared/models';

/**
 * Payment resolver
 *
 * @param route
 * @param state
 */
const paymentResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const paymentsService = inject(PaymentsService);
    const router = inject(Router);

    return paymentsService.get<Payment>(route.paramMap.get('id')).pipe(
        tap((result) => {
            paymentsService.selectedPayment.set(result);
        }),
        // Error here means the requested payment is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

/**
 * Can deactivate payments details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivatePaymentsDetails = (
    component: PaymentsDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/payments'
    // it means we are navigating away from the
    // payments app
    if (!nextState.url.includes('/payments')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another payment...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: PaymentsComponent,
        children: [
            {
                path: '',
                component: PaymentsListComponent,
                children: [
                    {
                        path: ':id',
                        component: PaymentsDetailsComponent,
                        resolve: {
                            payment: paymentResolver,
                            // countries: () => inject(PaymentsService).getCountries(),
                        },
                        canDeactivate: [canDeactivatePaymentsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
