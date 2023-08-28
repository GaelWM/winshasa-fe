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
import { MetadataService } from 'app/services/metadata.service';
import { SitesService } from 'app/services/sites.service';
import { TemplatesService } from 'app/services/templates.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { FormError, Metadata, Site, Template } from 'app/shared/models';

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
    ],
    standalone: true,
})
export class SiteFormComponent {
    public data = inject(MAT_DIALOG_DATA) as {
        title: string;
        site: Site;
        action: string;
    };
    public dialogRef = inject(MatDialogRef<SiteFormComponent>);
    private _templatesService = inject(TemplatesService);
    private _siteService = inject(SitesService);
    private _metadataService = inject(MetadataService);
    private _formBuilder = inject(FormBuilder);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    siteForm = computed(() => {
        const site = this.data.site;
        return this._formBuilder.group({
            id: [site?.id ?? ''],
            name: [
                site?.name ?? '',
                [Validators.required, Validators.minLength(2)],
            ],
            type: [site?.type ?? '', [Validators.required]],
            status: [site?.status ?? '', [Validators.required]],
            templateId: [site?.templateId ?? ''],
            latitude: [site?.latitude ?? ''],
            longitude: [site?.longitude ?? ''],
            isActive: [site?.isActive ?? true],
            details: this._formBuilder.group({
                description: [site?.details?.description ?? ''],
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
            ?.filter((t) => t.type === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.name,
            }));
    });

    siteTypeOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'type' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    siteStatusOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    onSubmitNewSite(siteForm: NgForm): void {
        this.submitted = true;
        if (this.data.action === 'edit' && this.data.site.id) {
            this.editSite(siteForm);
        } else {
            this.addSite(siteForm);
        }
    }

    private addSite(siteForm: NgForm): void {
        this._siteService.storeSite(siteForm.value).subscribe({
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

    private editSite(siteForm: NgForm): void {
        this._siteService
            .updateSite(this.data.site.id, siteForm.value)
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
