import { Routes } from '@angular/router';
import { IamComponent } from './iam.component';
import { canActivatePage } from 'app/guards/permission.guard';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
    {
        path: '',
        component: IamComponent,
        canActivate: [canActivatePage],
        data: {
            requiredPermission: 'iam.read',
        },
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./dashboard/dashboard.component').then(
                        (c) => c.DashboardComponent
                    ),
            },
            {
                path: 'users',
                loadComponent: () =>
                    import('./users/users.component').then(
                        (c) => c.UsersComponent
                    ),
            },
            {
                path: 'roles',
                loadComponent: () =>
                    import('./roles/roles.component').then(
                        (c) => c.RolesComponent
                    ),
            },
        ],
    },
] as Routes;
