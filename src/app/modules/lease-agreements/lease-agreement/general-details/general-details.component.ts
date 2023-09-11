import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    DestroyRef,
    inject,
    signal,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { LeaseAgreementsService } from 'app/services/lease-agreements.service.';
import { MetadataService } from 'app/services/metadata.service';
import { TemplatesService } from 'app/services/templates.service';
import { JsonFormFirstColDirective } from 'app/shared/components/json-form/json-form-first-item.directive';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import {
    ApiResult,
    FormError,
    LeaseAgreement,
    Metadata,
    Template,
} from 'app/shared/models';
import { Observable, switchMap, catchError, of, filter } from 'rxjs';

@Component({
    selector: 'app-general-details',
    templateUrl: './general-details.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        JsonFormComponent,
        MatExpansionModule,
        JsonFormFirstColDirective,
        MatSelectModule,
        FuseAlertComponent,
    ],
    standalone: true,
})
export class GeneralDetailsComponent {
    private _leaseAgreementService = inject(LeaseAgreementsService);
    private _templateService = inject(TemplatesService);
    private fb = inject(FormBuilder);
    private _metadataService = inject(MetadataService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('leaseAgreementNgForm') _form: NgForm;

    errors: WritableSignal<FormError[]> = signal([]);

    leaseAgreement = this._leaseAgreementService.selectedLeaseAgreement;
    leaseAgreementForm = computed(() => {
        const leaseAgreement = this.leaseAgreement().data as LeaseAgreement;
        return this.fb.group({
            id: [leaseAgreement?.id ?? ''],
            type: [leaseAgreement?.type ?? '', [Validators.required]],
            status: [leaseAgreement?.status ?? '', [Validators.required]],
            propertyId: [leaseAgreement?.propertyId ?? ''],
            propertyType: [
                { value: leaseAgreement?.propertyType ?? '', disabled: true },
            ],
            tenantId: [leaseAgreement?.tenantId ?? ''],
            landlordId: [leaseAgreement?.landlordId ?? ''],
            startDate: [leaseAgreement?.startDate ?? ''],
            endDate: [leaseAgreement?.endDate ?? ''],
            dailyRent: [leaseAgreement?.dailyRent ?? ''],
            monthlyRent: [leaseAgreement?.monthlyRent ?? ''],
            weeklyRent: [leaseAgreement?.weeklyRent ?? ''],
            annualRent: [leaseAgreement?.annualRent ?? ''],
            securityDeposit: [leaseAgreement?.securityDeposit ?? ''],
            paymentFrequency: [leaseAgreement?.paymentFrequency ?? ''],
            leaseTerm: [leaseAgreement?.leaseTerm ?? ''],
            moveInCondition: [leaseAgreement?.moveInCondition ?? ''],
            moveOutCondition: [leaseAgreement?.moveOutCondition ?? ''],
            templateId: [leaseAgreement?.templateId ?? ''],
            isActive: [leaseAgreement?.isActive ?? true],
            details: this.fb.group({
                description: [leaseAgreement?.details?.description ?? ''],
            }),
        });
    });

    private template$: Observable<ApiResult<Template>> = toObservable(
        this.leaseAgreement
    ).pipe(
        switchMap((leaseAgreement) =>
            this._templateService.get<Template>(
                (leaseAgreement.data as LeaseAgreement).templateId
            )
        ),
        catchError(() => of(undefined)),
        takeUntilDestroyed()
    );
    template = toSignal(this.template$, {
        initialValue: {} as ApiResult<Template>,
    });

    typeOptions = computed(() => {
        const metadata = this._metadataService.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'type' && t.entity === 'Lease')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });
    statusOptions = computed(() => {
        const metadata = this._metadataService.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Lease')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });
    propertyTypeOptions = signal([
        { id: '1', name: 'Site' },
        { id: '2', name: 'Product' },
    ]);

    constructor() {
        this._leaseAgreementService
            .onLeaseAgreementFormSubmit()
            .pipe(
                filter((submit) => submit),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.errors.set([]);
                this._form && this._form.ngSubmit.emit();
            });
    }

    onSaveLeaseAgreement(leaseAgreementForm: NgForm): void {
        const leaseAgreement = leaseAgreementForm.form.value;
        this._leaseAgreementService
            .updateLeaseAgreement(leaseAgreement.id, leaseAgreement)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                error: (err) => {
                    if (err?.error) {
                        this.errors.set([{ message: err?.error?.message }]);
                    }
                    if (err?.error?.errors) {
                        this.errors.set(err?.error?.errors);
                    }
                },
                complete: () => {
                    this._leaseAgreementService.submitLeaseAgreementForm(false);
                },
            });
    }
}
