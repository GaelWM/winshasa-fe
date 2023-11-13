import { Routes } from '@angular/router';
import { TemplatesComponent } from './templates.component';
import { canActivatePage } from 'app/guards/permission.guard';

export default [
    {
        path: '',
        component: TemplatesComponent,
        canActivate: [canActivatePage],
        data: {
            requiredPermission: 'templates.read',
        },
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./template/template.component').then(
                (m) => m.TemplateComponent
            ),
    },
] as Routes;
