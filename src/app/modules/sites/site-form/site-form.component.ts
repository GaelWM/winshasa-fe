import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    DestroyRef,
    Input,
    ViewChild,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MetadataService } from 'app/services/metadata.service';
import { SitesService } from 'app/services/sites.service';
import { TemplatesService } from 'app/services/templates.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import { WinFormBuilder } from 'app/shared/components/modal-template/modal-template.component';
import { ModalTemplateService } from 'app/shared/components/modal-template/modal-template.service';
import {
    TOAST_STATE,
    ToastService,
} from 'app/shared/components/toast/toast.service';
import {
    FormError,
    MetadataEntityType,
    Site,
    Template,
    TemplateType,
} from 'app/shared/models';

@Component({
    selector: 'app-site-form',
    templateUrl: './site-form.component.html',
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
        JsonFormComponent,
    ],
    standalone: true,
})
export class SiteFormComponent extends WinFormBuilder implements AfterViewInit {
    #templatesService = inject(TemplatesService);
    #siteService = inject(SitesService);
    #metadataService = inject(MetadataService);
    #formBuilder = inject(FormBuilder);
    #modalService = inject(ModalTemplateService);
    #toastService = inject(ToastService);
    #destroyRef = inject(DestroyRef);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    @ViewChild('siteNgForm') _form: NgForm;
    form: NgForm = {} as NgForm;

    @Input() showSaveButton = false;
    @Input() asModal = false;

    $site = this.#siteService.selectedSite;
    $siteForm = computed(() => {
        const site = this.#siteService.selectedSite().data as Site;
        return this.#formBuilder.group({
            id: [site?.id ?? ''],
            name: [
                site?.name ?? '',
                [Validators.required, Validators.minLength(2)],
            ],
            type: [site?.type ?? '', [Validators.required]],
            status: [site?.status ?? '', [Validators.required]],
            category: [site?.category ?? '', [Validators.required]],
            templateId: [site?.templateId ?? ''],
            latitude: [site?.latitude ?? ''],
            longitude: [site?.longitude ?? ''],
            isActive: [site?.isActive ?? true],
            details: this.#formBuilder.group({
                description: [site?.details?.description ?? ''],
            }),
        });
    });

    #templates$ = this.#templatesService.all<Template[]>({ perPage: 100 });
    $templates = toSignal(this.#templates$);
    $templateOpts = computed(() => {
        const templates = this.$templates()?.data as Template[];
        return templates
            ?.filter((t) => t.type === TemplateType.SITE)
            .map((t) => ({ id: t.id, name: t.name }));
    });
    $selectedTemplate: WritableSignal<Template | undefined> = signal(
        {} as Template
    );

    $siteTypeOpts = this.#metadataService.getComputedOptions(
        'type',
        MetadataEntityType.SITE
    );

    $siteStatusOpts = this.#metadataService.getComputedOptions(
        'status',
        MetadataEntityType.SITE
    );

    $siteCategoryOpts = this.#metadataService.getComputedOptions(
        'category',
        MetadataEntityType.SITE
    );

    constructor() {
        super();

        effect(
            () => {
                this.$siteForm()
                    .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((value) => this.onValuesChange(value));
            },
            { allowSignalWrites: true }
        );
        effect(
            () => {
                const site = this.#siteService.selectedSite().data as Site;
                site && this.onValuesChange(site);
            },
            { allowSignalWrites: true }
        );
    }

    ngAfterViewInit(): void {
        this.form = this._form;
    }

    onValuesChange(formData: any): void {
        const template = this.getSelectedTemplate(formData.templateId);
        this.$selectedTemplate.set(template);
    }

    onSubmitNewSite(siteForm: NgForm): void {
        this.submitted = true;
        const site = this.#siteService.selectedSite().data as Site;
        if (site.id) {
            this.editSite(siteForm);
        } else {
            this.addSite(siteForm);
        }
    }

    private getSelectedTemplate(templateId): Template | undefined {
        const templates = this.$templates()?.data as Template[];
        return templates?.find((t) => t.id === templateId);
    }

    private addSite(siteForm: NgForm): void {
        this.#siteService.storeSite(siteForm.value).subscribe({
            next: () => {
                this.#modalService.closeModal();
                this.#toastService.showToast(
                    TOAST_STATE.SUCCESS,
                    'Site added successfully'
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

    private editSite(siteForm: NgForm): void {
        const site = this.#siteService.selectedSite().data as Site;
        this.#siteService.updateSite(site.id, siteForm.value).subscribe({
            next: () => {
                this.#toastService.showToast(
                    TOAST_STATE.SUCCESS,
                    'Site updated successfully'
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
