import {
    Component,
    DestroyRef,
    TemplateRef,
    ViewChild,
    effect,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'app/shared/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColumnSetting } from 'app/shared/components/win-table/win-table.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TemplatesService } from '../../services/templates.service';
import { UserService } from 'app/services/user/user.service';
import { User } from 'app/services/user/user.types';
import { Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { ITemplate } from 'app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { TemplateFormComponent } from './template-form/template-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';

@Component({
    selector: 'app-template',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarComponent,
        MatButtonModule,
        MatIconModule,
        WinTableComponent,
        WinPaginatorComponent,
    ],
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent {
    private _userService = inject(UserService);
    private _templatesService = inject(TemplatesService);
    private _router = inject(Router);
    private _dialog = inject(MatDialog);
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    columns: ColumnSetting[] = [];
    templates = this._templatesService.templates;
    user = toSignal(this._userService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
                { title: 'Name', key: 'name', customClass: 'w-3/12' },
                { title: 'Type', key: 'type', customClass: 'w-3/12' },
                {
                    title: 'Active',
                    key: 'is_active',
                    customClass: 'w-3/12',
                    pipe: { class: { obj: IsActivePipe } },
                },
                {
                    title: 'Description',
                    key: 'details.description',
                    customClass: 'w-3/12',
                },
                { title: 'Actions', key: 'action', template: this.actionsTpl },
            ];
        });
    }

    onPageChange(event: PageEvent) {
        this._router.navigate([], {
            queryParams: {
                page: event.pageIndex + 1,
                perPage: event.pageSize,
            },
            queryParamsHandling: 'merge',
        });
    }

    onAddTemplate(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open(TemplateFormComponent, {
            data: {
                title: 'Add new template',
                action: 'add',
            },
        });
    }

    onEditTemplate(event: Event, template: ITemplate) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open(TemplateFormComponent, {
            data: {
                title: 'Edit  template',
                template: template,
                action: 'edit',
            },
        });
    }

    onDeleteTemplate(event: Event, template: ITemplate) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete template',
            message:
                'Are you sure you want to delete this template and its groups and fields? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._templatesService
                    .deleteTemplate(template.id)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
            }
        });
    }
}
