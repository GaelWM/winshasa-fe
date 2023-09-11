import { Routes } from '@angular/router';
import { LeaseAgreementsComponent } from './lease-agreements.component';

export default [
    {
        path: '',
        component: LeaseAgreementsComponent,
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
            // {
            //     path: 'documentation',
            //     loadChildren: () =>
            //         import(
            //             'app/modules/sites/site/file-manager/file-manager.module'
            //         ).then((m) => m.FileManagerModule),
            // },
        ],
    },
] as Routes;
