import { CommonModule } from '@angular/common';
import {
    Component,
    ViewEncapsulation,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiResult, LeaseAgreement } from 'app/shared/models';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { LeaseAgreementsService } from 'app/services/lease-agreements.service.';

@Component({
    selector: 'app-lease-agreement',
    templateUrl: './lease-agreement.component.html',
    styleUrls: ['./lease-agreement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
        MatButtonModule,
        RouterModule,
    ],

    standalone: true,
})
export class LeaseAgreementComponent {
    private _leaseAgreementService = inject(LeaseAgreementsService);
    private _route = inject(ActivatedRoute);

    background: ThemePalette = 'accent';

    private leaseAgreement$: Observable<ApiResult<LeaseAgreement>> =
        this._route.params.pipe(
            switchMap((params) =>
                this._leaseAgreementService.get<LeaseAgreement>(params['id'])
            ),
            tap((leaseAgreement: ApiResult<LeaseAgreement>) => {
                if (leaseAgreement) {
                    this._leaseAgreementService.selectedLeaseAgreement.set(
                        leaseAgreement
                    );
                }
            }),
            catchError(() => of(undefined)),
            takeUntilDestroyed()
        );
    leaseAgreementTemp = toSignal(this.leaseAgreement$, {
        initialValue: {} as ApiResult<LeaseAgreement>,
    });

    leaseAgreement = signal({} as ApiResult<LeaseAgreement>);

    constructor() {
        effect(() => {
            this.leaseAgreementTemp();
            this.leaseAgreement =
                this._leaseAgreementService.selectedLeaseAgreement;
        });
    }

    onSave(event: Event): void {
        event.preventDefault();
        this._leaseAgreementService.submitLeaseAgreementForm(true);
    }
}
