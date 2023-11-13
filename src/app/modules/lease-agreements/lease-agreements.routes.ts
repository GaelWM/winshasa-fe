import { Routes } from '@angular/router';
import { LeaseAgreementsComponent } from './lease-agreements.component';
import { canActivatePage } from 'app/guards/permission.guard';

export default [
    {
        path: '',
        component: LeaseAgreementsComponent,
        canActivate: [canActivatePage],
        data: {
            requiredPermission: 'leases.read',
        },
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./lease-agreement/lease-agreement.component').then(
                (c) => c.LeaseAgreementComponent
            ),
        children: [
            {
                path: 'general-details',
                loadComponent: () =>
                    import(
                        './lease-agreement/general-details/general-details.component'
                    ).then((m) => m.GeneralDetailsComponent),
            },
            {
                path: 'payments',
                loadComponent: () =>
                    import(
                        './lease-agreement/lease-payment/lease-payment.component'
                    ).then((m) => m.LeasePaymentComponent),
                children: [
                    {
                        path: ':id',
                        loadComponent: () =>
                            import(
                                './lease-agreement/lease-payment/lease-payment.component'
                            ).then((m) => m.LeasePaymentComponent),
                    },
                ],
            },
            {
                path: 'documentation',
                loadChildren: () =>
                    import(
                        './lease-agreement/documentation/documentation.routes'
                    ),
            },
        ],
    },
] as Routes;
