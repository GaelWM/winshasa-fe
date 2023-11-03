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
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { ProjectsService } from '../../services/projects.service';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { ApiResult, IProject, Project, User } from 'app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { Observable, distinctUntilChanged, map, switchMap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateHelperPipe } from 'app/shared/pipes/date-helper-pipe/date-helper.pipe';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ModalTemplateComponent } from 'app/shared/components/modal-template/modal-template.component';

@Component({
    selector: 'app-project',
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
    templateUrl: './projects.component.html',
})
export class ProjectsComponent {
    #userService = inject(UserService);
    #projectsService = inject(ProjectsService);
    #router = inject(Router);
    #route = inject(ActivatedRoute);
    #dialog = inject(MatDialog);
    #fuseConfirmationService = inject(FuseConfirmationService);
    #destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    #projects$: Observable<ApiResult<Project[]>> = toObservable(
        this.#projectsService.queries
    ).pipe(
        distinctUntilChanged(),
        switchMap((params) => this.#projectsService.all<Project[]>(params)),
        map((result: ApiResult<Project[]>) => {
            if (result.data) {
                this.#projectsService.projects.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    $projects = toSignal(this.#projects$);

    columns: ColumnSetting[] = [];
    user = toSignal(this.#userService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
                {
                    title: 'Name',
                    key: 'name',
                    clickEvent: true,
                    sortKey: 'name',
                },
                {
                    title: 'Type',
                    key: 'type',
                    clickEvent: true,
                    sortKey: 'type',
                },
                {
                    title: 'Status',
                    key: 'status',
                    clickEvent: true,
                    sortKey: 'status',
                },
                {
                    title: 'Start Date',
                    key: 'startDate',
                    clickEvent: true,
                    sortKey: 'startDate',
                    pipe: { class: { obj: DateHelperPipe } },
                },
                {
                    title: 'End Date',
                    key: 'endDate',
                    clickEvent: true,
                    sortKey: 'endDate',
                    pipe: { class: { obj: DateHelperPipe } },
                },
                {
                    title: 'Cost',
                    key: 'cost',
                    clickEvent: true,
                    sortKey: 'cost',
                },
                {
                    title: 'Owner',
                    key: 'owner.fullName',
                    clickEvent: true,
                },
                {
                    title: 'Template',
                    key: 'template.name',
                    clickEvent: true,
                },
                {
                    title: 'Created At',
                    key: 'createdAt',
                    clickEvent: true,
                    sortKey: 'createdAt',
                },
                {
                    title: 'Updated At',
                    key: 'updatedAt',
                    clickEvent: true,
                    sortKey: 'updatedAt',
                },
                { title: 'Actions', key: 'action', template: this.actionsTpl },
            ];
        });
    }

    onPageChange(event: PageEvent) {
        this.#router.navigate([], {
            queryParams: {
                page: event.pageIndex + 1,
                perPage: event.pageSize,
            },
            queryParamsHandling: 'merge',
        });
    }

    onSort(event: ColumnSetting): void {
        this.#router.navigate([], {
            queryParams: { orderBy: `${event.sortKey}:${event.sortOrder}` },
            queryParamsHandling: 'merge',
            relativeTo: this.#route,
        });
    }

    onRowClick(event: Project): void {
        this.#router.navigate(['projects', event.id, 'general-details']);
    }

    onAddProject(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.#projectsService.selectedProject.set({ data: null });
        this.#dialog.open(ModalTemplateComponent, {
            data: {
                form: ProjectFormComponent,
                title: 'Add Project',
            },
        });
    }

    onEditProject(event: Event, project: Project) {
        event.preventDefault();
        event.stopPropagation();
        this.#projectsService.selectedProject.set({ data: project });
        this.#dialog.open(ModalTemplateComponent, {
            data: {
                form: ProjectFormComponent,
                title: 'Edit Project',
            },
        });
    }

    onDeleteProject(event: Event, project: IProject) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this.#fuseConfirmationService.open({
            title: 'Delete project',
            message:
                'Are you sure you want to delete this project? This action cannot be undone.',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.#projectsService
                    .deleteProject(project.id)
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe();
            }
        });
    }
}
