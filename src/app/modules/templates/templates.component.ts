import {
    Component,
    DestroyRef,
    TemplateRef,
    ViewChild,
    effect,
    inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToolbarComponent } from 'app/shared/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColumnSetting } from 'app/shared/components/win-table/win-table.model';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { TemplatesService } from '../../services/templates.service';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { ApiResult, ITemplate, Template, User } from 'app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { TemplateFormComponent } from './template-form/template-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { Observable, map, switchMap } from 'rxjs';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { MatTooltipModule } from '@angular/material/tooltip';

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
        IsActivePipe,
        MatTooltipModule,
    ],
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent {
    private _userService = inject(UserService);
    private _templatesService = inject(TemplatesService);
    private _router = inject(Router);
    private _route = inject(ActivatedRoute);
    private _dialog = inject(MatDialog);
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    private templates$: Observable<ApiResult<Template[]>> = toObservable(
        this._templatesService.queries
    ).pipe(
        switchMap((params) => this._templatesService.all<Template[]>(params)),
        map((result: ApiResult<Template[]>) => {
            if (result.data) {
                this._templatesService.templates.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    templates = toWritableSignal(this.templates$, {} as ApiResult<Template[]>);

    columns: ColumnSetting[] = [];
    user = toSignal(this._userService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
                {
                    title: 'Name',
                    key: 'name',
                    customClass: 'w-2/12',
                    clickEvent: true,
                    sortKey: 'name',
                },
                {
                    title: 'Type',
                    key: 'type',
                    customClass: 'w-2/12',
                    clickEvent: true,
                    sortKey: 'type',
                },
                {
                    title: 'Active',
                    key: 'isActive',
                    customClass: 'w-2/12',
                    pipe: { class: { obj: IsActivePipe } },
                    sortKey: 'isActive',
                },
                {
                    title: 'Description',
                    key: 'details.description',
                    customClass: 'w-2/12',
                },
                {
                    title: 'Created At',
                    key: 'createdAt',
                    clickEvent: true,
                    customClass: 'w-2/12',
                    sortKey: 'createdAt',
                    pipe: {
                        class: { obj: DatePipe, constructor: 'en-US' },
                        args: 'MMM d, y, hh:mm:ss',
                    },
                },
                {
                    title: 'Updated At',
                    key: 'updatedAt',
                    customClass: 'w-2/12',
                    clickEvent: true,
                    sortKey: 'updatedAt',
                    pipe: {
                        class: { obj: DatePipe, constructor: 'en-US' },
                        args: 'MMM d, y, hh:mm:ss',
                    },
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

    onSort(event: ColumnSetting): void {
        this._router.navigate([], {
            queryParams: { orderBy: `${event.sortKey}:${event.sortOrder}` },
            queryParamsHandling: 'merge',
            relativeTo: this._route,
        });
    }

    onRowClick(event: Template): void {
        this._templatesService.selectedTemplate.set({ data: event });
        this._router.navigate(['templates', event.id]);
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
