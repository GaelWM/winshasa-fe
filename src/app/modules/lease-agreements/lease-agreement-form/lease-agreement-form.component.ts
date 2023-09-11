import { CommonModule } from '@angular/common';
import {
    Component,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { LeaseAgreementsService } from 'app/services/lease-agreements.service.';
import { MetadataService } from 'app/services/metadata.service';
import { TemplatesService } from 'app/services/templates.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import {
    FormError,
    Metadata,
    LeaseAgreement,
    Template,
} from 'app/shared/models';

@Component({
    selector: 'app-lease-agreement-form',
    templateUrl: './lease-agreement-form.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        FuseAlertComponent,
        ErrorFormTemplateComponent,
    ],
    standalone: true,
})
export class LeaseAgreementFormComponent {
    public data = inject(MAT_DIALOG_DATA) as {
        title: string;
        leaseAgreement: LeaseAgreement;
        action: string;
    };
    public dialogRef = inject(MatDialogRef<LeaseAgreementFormComponent>);
    private _templatesService = inject(TemplatesService);
    private _leaseAgreementService = inject(LeaseAgreementsService);
    private _metadataService = inject(MetadataService);
    private _formBuilder = inject(FormBuilder);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    leaseAgreementForm = computed(() => {
        const leaseAgreement = this.data.leaseAgreement;
        return this._formBuilder.group({
            id: [leaseAgreement?.id ?? ''],
            type: [leaseAgreement?.type ?? '', [Validators.required]],
            status: [leaseAgreement?.status ?? '', [Validators.required]],
            propertyId: [leaseAgreement?.propertyId ?? ''],
            propertyType: [leaseAgreement?.propertyType ?? ''],
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
            details: this._formBuilder.group({
                description: [leaseAgreement?.details?.description ?? ''],
            }),
        });
    });

    templates$ = this._templatesService.all<Template[]>({ perPage: 100 });
    templates = toSignal(this.templates$);

    metadata$ = this._metadataService.all<Metadata[]>({ perPage: 100 });
    metadata = toSignal(this.metadata$);

    templateOptions = computed(() => {
        const templates = this.templates()?.data as Template[];
        return templates
            ?.filter((t) => t.type === 'LeaseAgreement')
            .map((t) => ({
                id: t.id,
                name: t.name,
            }));
    });

    leaseAgreementTypeOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'type' && t.entity === 'Lease')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    leaseAgreementStatusOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Lease')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    onSubmitNewLeaseAgreement(leaseAgreementForm: NgForm): void {
        this.submitted = true;
        if (this.data.action === 'edit' && this.data.leaseAgreement.id) {
            this.editLeaseAgreement(leaseAgreementForm);
        } else {
            this.addLeaseAgreement(leaseAgreementForm);
        }
    }

    private addLeaseAgreement(leaseAgreementForm: NgForm): void {
        this._leaseAgreementService
            .storeLeaseAgreement(leaseAgreementForm.value)
            .subscribe({
                next: () => {
                    this.dialogRef.close();
                },
                error: (err) => {
                    if (err?.error) {
                        this.errors.set([{ message: err?.error?.message }]);
                    }
                    if (err?.error?.errors) {
                        this.errors.set(err?.error?.errors);
                    }
                },
            });
    }

    private editLeaseAgreement(leaseAgreementForm: NgForm): void {
        this._leaseAgreementService
            .updateLeaseAgreement(
                this.data.leaseAgreement.id,
                leaseAgreementForm.value
            )
            .subscribe({
                next: () => {
                    this.dialogRef.close();
                },
                error: (err) => {
                    if (err?.error) {
                        this.errors.set([{ message: err?.error?.message }]);
                    }
                    if (err?.error?.errors) {
                        this.errors.set(err?.error?.errors);
                    }
                },
            });
    }

    onCloseModal(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.dialogRef.close('modal closed');
    }
}
