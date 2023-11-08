import { CommonModule, formatDate } from '@angular/common';
import {
    AfterViewInit,
    Component,
    DestroyRef,
    Input,
    ViewChild,
    ViewEncapsulation,
    WritableSignal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAlertComponent } from '@fuse/components/alert';
import { LeaseAgreementsService } from 'app/services/lease-agreements.service.';
import { MetadataService } from 'app/services/metadata.service';
import { ProductsService } from 'app/services/products.service';
import { SitesService } from 'app/services/sites.service';
import { TemplatesService } from 'app/services/templates.service';
import { UserService } from 'app/services/user.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { WinFormBuilder } from 'app/shared/components/modal-template/modal-template.component';
import { ModalTemplateService } from 'app/shared/components/modal-template/modal-template.service';
import {
    TOAST_STATE,
    ToastService,
} from 'app/shared/components/toast/toast.service';
import {
    FormError,
    LeaseAgreement,
    Template,
    User,
    MetadataEntityType,
    Product,
    Site,
    PaymentFrequency,
    CURRENCIES,
    TemplateType,
} from 'app/shared/models';
import { catchError, map, of } from 'rxjs';

@Component({
    selector: 'app-lease-agreement-form',
    templateUrl: './lease-agreement-form.component.html',
    styleUrls: ['./lease-agreement-form.component.scss'],
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
        MatDatepickerModule,
        FuseAlertComponent,
        MatRadioModule,
        ErrorFormTemplateComponent,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
})
export class LeaseAgreementFormComponent
    extends WinFormBuilder
    implements AfterViewInit
{
    #templatesService = inject(TemplatesService);
    #formBuilder = inject(FormBuilder);
    #userService = inject(UserService);
    #metadataService = inject(MetadataService);
    #productsService = inject(ProductsService);
    #sitesService = inject(SitesService);
    #leaseService = inject(LeaseAgreementsService);
    #modalService = inject(ModalTemplateService);
    #destroyRef = inject(DestroyRef);
    #toastService = inject(ToastService);

    @Input() showSaveButton = false;

    @ViewChild('leaseAgreementNgForm') _form: NgForm;
    form: NgForm = {} as NgForm;

    formFieldHelpers: string = '';
    submitted: boolean = false;
    paymentFrequency = PaymentFrequency;
    paymentFrequencyOpts = Object.values(PaymentFrequency);
    paymentCurrenciesOpts = CURRENCIES;

    errors: WritableSignal<FormError[]> = signal([]);
    $leaseForm = computed(() => {
        const leaseAgreement = this.#leaseService.selectedLeaseAgreement()
            .data as LeaseAgreement;

        return this.#formBuilder.group({
            id: [leaseAgreement?.id ?? ''],
            type: [leaseAgreement?.type ?? '', [Validators.required]],
            status: [leaseAgreement?.status ?? '', [Validators.required]],
            propertyId: [leaseAgreement?.propertyId ?? ''],
            propertyType: [leaseAgreement?.propertyType ?? ''],
            tenantId: [leaseAgreement?.tenantId ?? ''],
            landlordId: [leaseAgreement?.landlordId ?? ''],
            startDate: [leaseAgreement?.startDate ?? ''],
            endDate: [leaseAgreement?.endDate ?? ''],
            paymentFrequency: [leaseAgreement?.paymentFrequency ?? ''],
            currency: [leaseAgreement?.currency ?? ''],
            rent: [leaseAgreement?.rent ?? ''],
            securityDeposit: [leaseAgreement?.securityDeposit ?? ''],
            leaseTerm: [leaseAgreement?.leaseTerm ?? ''],
            moveInCondition: [leaseAgreement?.moveInCondition ?? ''],
            moveOutCondition: [leaseAgreement?.moveOutCondition ?? ''],
            templateId: [leaseAgreement?.templateId ?? ''],
            details: this.#formBuilder.group({
                description: [leaseAgreement?.details?.description ?? ''],
            }),
        });
    });

    #templates$ = this.#templatesService.all<Template[]>({ perPage: 100 });
    $templates = toSignal(this.#templates$);

    $templateOpts = computed(() => {
        const templates = this.$templates()?.data as Template[];
        return templates
            ?.filter((t) => t.type === TemplateType.LEASE)
            .map((t) => ({ id: t.id, name: t.name }));
    });

    #users$ = this.#userService.getUsersWithRole('landlord,tenant').pipe(
        takeUntilDestroyed(),
        map((d) => d.data as User[]),
        catchError(() => of([] as User[]))
    );

    #landlord$ = this.#users$.pipe(
        map((users) => users.filter((user) => user.roles.includes('landlord'))),
        map((users) => users.map((u) => ({ id: u.id, name: u.fullName })))
    );

    #tenant$ = this.#users$.pipe(
        map((users) => users.filter((user) => user.roles.includes('tenant'))),
        map((users) => users.map((u) => ({ id: u.id, name: u.fullName })))
    );

    $tenants = toSignal(this.#tenant$, {
        initialValue: [] as { id: string; name: string }[],
    });
    $landlords = toSignal(this.#landlord$, {
        initialValue: [] as { id: string; name: string }[],
    });

    $types = this.#metadataService.getComputedOptions(
        'type',
        MetadataEntityType.LEASE
    );
    $propertyTypes = this.#metadataService.getComputedOptions(
        'propertyType',
        MetadataEntityType.LEASE
    );
    $statuses = this.#metadataService.getComputedOptions(
        'status',
        MetadataEntityType.LEASE
    );

    #products$ = this.#productsService.all({ perPage: 100 }).pipe(
        takeUntilDestroyed(),
        map((d) => d.data as Product[]),
        map((products) => products.map((p) => ({ id: p.id, name: p.name }))),
        catchError(() => of([] as { id: string; name: string }[]))
    );
    $products = toSignal(this.#products$, {
        initialValue: [] as { id: string; name: string }[],
    });
    #sites$ = this.#sitesService.all({ perPage: 100 }).pipe(
        takeUntilDestroyed(),
        map((d) => d.data as Site[]),
        map((sites) => sites.map((s) => ({ id: s.id, name: s.name }))),
        catchError(() => of([] as { id: string; name: string }[]))
    );
    $sites = toSignal(this.#sites$, {
        initialValue: [] as { id: string; name: string }[],
    });
    $properties: WritableSignal<{ id: string; name: string }[]> = signal([]);

    constructor() {
        super();
        effect(
            () => {
                this.$leaseForm()
                    .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((value) => this.onValuesChange(value));
            },
            { allowSignalWrites: true }
        );
        effect(
            () => {
                const leaseAgreement =
                    this.#leaseService.selectedLeaseAgreement()
                        .data as LeaseAgreement;
                leaseAgreement && this.onValuesChange(leaseAgreement);
            },
            { allowSignalWrites: true }
        );
    }

    ngAfterViewInit(): void {
        this.form = this._form;
    }

    onValuesChange(formData: any): void {
        if (formData.propertyType === 'SITE') {
            this.$properties.set(this.$sites());
        }
        if (formData.propertyType === 'PRODUCT') {
            this.$properties.set(this.$products());
        }
    }

    onSubmitNewLeaseAgreement(leaseAgreementForm: NgForm): void {
        this.submitted = true;
        leaseAgreementForm.value.startDate = formatDate(
            leaseAgreementForm.value.startDate,
            'yyyy-MM-dd',
            'en-US'
        );
        leaseAgreementForm.value.endDate = formatDate(
            leaseAgreementForm.value.endDate,
            'yyyy-MM-dd',
            'en-US'
        );

        const leaseAgreement = this.#leaseService.selectedLeaseAgreement()
            .data as LeaseAgreement;

        if (leaseAgreement?.id) {
            this.editLeaseAgreement(leaseAgreementForm);
        } else {
            this.addLeaseAgreement(leaseAgreementForm);
        }
    }

    private addLeaseAgreement(leaseAgreementForm: NgForm): void {
        this.#leaseService
            .storeLeaseAgreement(leaseAgreementForm.value)
            .subscribe({
                next: () => {
                    this.#modalService.closeModal();
                    this.#toastService.showToast(
                        TOAST_STATE.SUCCESS,
                        'Leased added successfully!'
                    );
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
        const leaseAgreement = this.#leaseService.selectedLeaseAgreement()
            .data as LeaseAgreement;
        this.#leaseService
            .updateLeaseAgreement(leaseAgreement.id, leaseAgreementForm.value)
            .subscribe({
                next: () => {
                    this.#modalService.closeModal();
                    this.#toastService.showToast(
                        TOAST_STATE.SUCCESS,
                        'Lease updated successfully!'
                    );
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
}
