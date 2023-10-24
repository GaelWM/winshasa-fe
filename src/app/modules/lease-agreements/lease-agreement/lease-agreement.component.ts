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
import { MatDialog } from '@angular/material/dialog';

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
    #leaseService = inject(LeaseAgreementsService);
    #route = inject(ActivatedRoute);
    #dialog = inject(MatDialog);

    background: ThemePalette = 'accent';

    private leaseAgreement$: Observable<ApiResult<LeaseAgreement>> =
        this.#route.params.pipe(
            switchMap((params) =>
                this.#leaseService.get<LeaseAgreement>(params['id'])
            ),
            tap((leaseAgreement: ApiResult<LeaseAgreement>) => {
                if (leaseAgreement) {
                    this.#leaseService.selectedLeaseAgreement.set(
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
            this.leaseAgreement = this.#leaseService.selectedLeaseAgreement;
        });
    }

    onSave(event: Event): void {
        event.preventDefault();
        this.#leaseService.submitLeaseAgreementForm(true);
    }

    openDetailDialog(): void {
        const dialogRef = this.#dialog.open(LeaseAgreementComponent, {
            width: '400px', // Set the width as per your requirements
        });
    }
}
