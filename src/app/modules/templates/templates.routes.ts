import { Routes } from '@angular/router';
import { TemplatesComponent } from './templates.component';

export default [
    {
        path: '',
        component: TemplatesComponent,
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./template/template.component').then(
                (m) => m.TemplateComponent
            ),
    },
] as Routes;
