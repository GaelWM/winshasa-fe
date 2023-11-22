import { Routes } from '@angular/router';
import { canActivatePage } from 'app/guards/permission.guard';
import { InvoicesComponent } from './invoices.component';

export default [
    {
        path: '',
        component: InvoicesComponent,
        canActivate: [canActivatePage],
        data: {
            requiredPermission: 'invoices.read',
        },
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./invoice/invoice.component').then(
                (m) => m.InvoiceComponent
            ),
        children: [
            {
                path: 'general-details',
                loadComponent: () =>
                    import(
                        './invoice/general-details/general-details.component'
                    ).then((m) => m.GeneralDetailsComponent),
            },
            {
                path: 'documentation',
                loadChildren: () =>
                    import('./invoice/documentation/documentation.routes'),
            },
        ],
    },
] as Routes;
