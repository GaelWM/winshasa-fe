import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
        ],
    },

    // Error routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'forbidden',
                loadComponent: () =>
                    import(
                        'app/modules/errors/error-403/error-403.component'
                    ).then((m) => m.Error403Component),
            },
            {
                path: 'not-found',
                loadComponent: () =>
                    import(
                        'app/modules/errors/error-404/error-404.component'
                    ).then((m) => m.Error404Component),
            },
            {
                path: 'error',
                loadComponent: () =>
                    import(
                        'app/modules/errors/error-500/error-500.component'
                    ).then((m) => m.Error500Component),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            {
                path: 'templates',
                loadChildren: () =>
                    import('app/modules/templates/templates.routes'),
            },
            {
                path: 'sites',
                loadChildren: () => import('app/modules/sites/sites.routes'),
            },
            {
                path: 'products',
                loadChildren: () =>
                    import('app/modules/products/products.routes'),
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('app/modules/profile/profile.component').then(
                        (m) => m.ProfileComponent
                    ),
            },
        ],
    },
];
