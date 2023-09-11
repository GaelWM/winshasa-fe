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
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import {
    ApiResult,
    ILeaseAgreement,
    LeaseAgreement,
    User,
} from 'app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { LeaseAgreementFormComponent } from './lease-agreement-form/lease-agreement-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { Observable, map, switchMap } from 'rxjs';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeaseAgreementsService } from 'app/services/lease-agreements.service.';

@Component({
    selector: 'app-lease-agreement',
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
    templateUrl: './lease-agreements.component.html',
})
export class LeaseAgreementsComponent {
    private _userService = inject(UserService);
    private _leaseAgreementsService = inject(LeaseAgreementsService);
    private _router = inject(Router);
    private _route = inject(ActivatedRoute);
    private _dialog = inject(MatDialog);
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    private leaseAgreements$: Observable<ApiResult<LeaseAgreement[]>> =
        toObservable(this._leaseAgreementsService.queries).pipe(
            switchMap((params) =>
                this._leaseAgreementsService.all<LeaseAgreement[]>(params)
            ),
            map((result: ApiResult<LeaseAgreement[]>) => {
                if (result.data) {
                    this._leaseAgreementsService.leaseAgreements.set(result);
                }
                return result;
            }),
            takeUntilDestroyed()
        );
    leaseAgreements = toWritableSignal(
        this.leaseAgreements$,
        {} as ApiResult<LeaseAgreement[]>
    );

    columns: ColumnSetting[] = [];
    user = toSignal(this._userService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
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
                    title: 'Property Type',
                    key: 'propertyType',
                    clickEvent: true,
                    sortKey: 'propertyType',
                },
                {
                    title: 'Start Date',
                    key: 'startDate',
                    clickEvent: true,
                    sortKey: 'startDate',
                    pipe: {
                        class: {
                            obj: DatePipe,
                            constructor: 'en-US',
                        },
                        args: 'yyyy-MM-dd',
                    },
                },
                {
                    title: 'End Date',
                    key: 'endDate',
                    clickEvent: true,
                    sortKey: 'endDate',
                    pipe: {
                        class: {
                            obj: DatePipe,
                            constructor: 'en-US',
                        },
                        args: 'yyyy-MM-dd',
                    },
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
            queryParams: {
                sortBy: event.sortKey,
                sortOrder: event.sortOrder,
            },
            queryParamsHandling: 'merge',
            relativeTo: this._route,
        });
    }

    onRowClick(event: LeaseAgreement): void {
        this._router.navigate([
            'lease-agreements',
            event.id,
            'general-details',
        ]);
    }

    onAddLeaseAgreement(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open(LeaseAgreementFormComponent, {
            data: {
                title: 'Add new lease agreement',
                action: 'add',
            },
        });
    }

    onEditLeaseAgreement(event: Event, leaseAgreement: ILeaseAgreement) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open(LeaseAgreementFormComponent, {
            data: {
                title: 'Edit  lease agreement',
                leaseAgreement: leaseAgreement,
                action: 'edit',
            },
        });
    }

    onDeleteLeaseAgreement(event: Event, leaseAgreement: ILeaseAgreement) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete lease agreement',
            message:
                'Are you sure you want to delete this lease agreement and its groups and fields? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._leaseAgreementsService
                    .deleteLeaseAgreement(leaseAgreement.id)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
            }
        });
    }
}
