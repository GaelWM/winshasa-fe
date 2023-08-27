import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    DestroyRef,
    inject,
    ViewChild,
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
import { MetadataService } from 'app/services/metadata.service';
import { SitesService } from 'app/services/sites.service';
import { TemplatesService } from 'app/services/templates.service';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import { ApiResult, Metadata, Site, Template } from 'app/shared/models';
import { Observable, switchMap, catchError, of } from 'rxjs';

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
    ],
    standalone: true,
})
export class GeneralDetailsComponent {
    private _siteService = inject(SitesService);
    private _templateService = inject(TemplatesService);
    private fb = inject(FormBuilder);
    private _metadataService = inject(MetadataService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('generatedSiteForm') _form: NgForm;

    site = this._siteService.selectedSite;
    siteForm = computed(() => {
        const site = this.site().data as Site;
        return this.fb.group({
            id: [site?.id],
            name: [site?.name, Validators.required],
            template_id: [site?.templateId],
            status: [site?.status, Validators.required],
            type: [site?.type, Validators.required],
            latitude: [site?.latitude],
            longitude: [site?.longitude],
            details: this.fb.group({}),
        });
    });

    private template$: Observable<ApiResult<Template>> = toObservable(
        this.site
    ).pipe(
        switchMap((site) =>
            this._templateService.get<Template>((site.data as Site).templateId)
        ),
        catchError(() => of(undefined)),
        takeUntilDestroyed()
    );
    template = toSignal(this.template$, {
        initialValue: {} as ApiResult<Template>,
    });

    metadata$ = this._metadataService.all<Metadata[]>({ perPage: 100 });
    metadata = toSignal(this.metadata$);

    typeOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'type' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    statusOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    categoryOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Site')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    constructor() {
        // this.siteForm()
        //     .statusChanges.pipe(takeUntilDestroyed(this.destroyRef))
        //     .subscribe();
        // this._siteService.onSubmitForm().pipe(filter((submit) => submit)),
        //     takeUntilDestroyed(this.destroyRef).subscribe(() => {
        //         this._form.ngSubmit.emit();
        //     });
    }

    onSaveSite(siteForm: NgForm): void {
        const site = new Site(siteForm.form.value);
        this._siteService
            .updateSite(site.id, site)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
