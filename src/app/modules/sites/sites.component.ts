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
import { SitesService } from '../../services/sites.service';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { ApiResult, ISite, Site, User } from 'app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { SiteFormComponent } from './site-form/site-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { Observable, map, switchMap } from 'rxjs';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalTemplateComponent } from 'app/shared/components/modal-template/modal-template.component';
import { PermissionsService } from 'app/services/permissions.service';

@Component({
    selector: 'app-site',
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
    providers: [PermissionsService],
    templateUrl: './sites.component.html',
})
export class SitesComponent {
    #userService = inject(UserService);
    #sitesService = inject(SitesService);
    #router = inject(Router);
    #route = inject(ActivatedRoute);
    #dialog = inject(MatDialog);
    #fuseConfirmationService = inject(FuseConfirmationService);
    #permissionService = inject(PermissionsService);
    #destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    private sites$: Observable<ApiResult<Site[]>> = toObservable(
        this.#sitesService.queries
    ).pipe(
        switchMap((params) => this.#sitesService.all<Site[]>(params)),
        map((result: ApiResult<Site[]>) => {
            if (result.data) {
                this.#sitesService.sites.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    sites = toWritableSignal(this.sites$, {} as ApiResult<Site[]>);

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
                    title: 'Latitude',
                    key: 'latitude',
                    clickEvent: true,
                    sortKey: 'latitude',
                },
                {
                    title: 'Longitude',
                    key: 'longitude',
                    clickEvent: true,
                    sortKey: 'longitude',
                },
                {
                    title: 'Active',
                    key: 'isActive',
                    pipe: { class: { obj: IsActivePipe } },
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

    onRowClick(event: Site): void {
        this.#router.navigate(['sites', event.id, 'general-details']);
    }

    onAddSite(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const canPerform = this.#permissionService.hasPermission(
            'sites.create',
            'You are not allowed to perform this action'
        );
        if (canPerform) {
            this.#dialog.open(ModalTemplateComponent, {
                data: {
                    form: SiteFormComponent,
                    title: 'Add Site',
                    inputs: { asModal: true },
                },
            });
        }
    }

    onEditSite(event: Event, site: ISite) {
        event.preventDefault();
        event.stopPropagation();
        this.#dialog.open(ModalTemplateComponent, {
            data: {
                form: SiteFormComponent,
                title: 'Edit Site',
                inputs: { asModal: true },
            },
        });
    }

    onDeleteSite(event: Event, site: ISite) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this.#fuseConfirmationService.open({
            title: 'Delete site',
            message:
                'Are you sure you want to delete this site and its groups and fields? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.#sitesService
                    .deleteSite(site.id)
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe();
            }
        });
    }
}
