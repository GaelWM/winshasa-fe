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
import { ProjectsService } from 'app/services/projects.service';
import { MetadataService } from 'app/services/metadata.service';
import { TemplatesService } from 'app/services/templates.service';
import { UserService } from 'app/services/user.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { WinFormBuilder } from 'app/shared/components/modal-template/modal-template.component';
import { ModalTemplateService } from 'app/shared/components/modal-template/modal-template.service';
import {
    FormError,
    Project,
    Template,
    User,
    MetadataEntityType,
    PaymentFrequency,
    ProjectStatus,
    TemplateType,
} from 'app/shared/models';
import { catchError, map, of } from 'rxjs';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import {
    TOAST_STATE,
    ToastService,
} from 'app/shared/components/toast/toast.service';

@Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html',
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
        JsonFormComponent,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
})
export class ProjectFormComponent
    extends WinFormBuilder
    implements AfterViewInit
{
    #templatesService = inject(TemplatesService);
    #formBuilder = inject(FormBuilder);
    #userService = inject(UserService);
    #metadataService = inject(MetadataService);
    #projectService = inject(ProjectsService);
    #modalService = inject(ModalTemplateService);
    #destroyRef = inject(DestroyRef);
    #toastService = inject(ToastService);

    @Input() showSaveButton = false;
    @Input() asModal = false;

    @ViewChild('projectNgForm') _form: NgForm;
    form: NgForm = {} as NgForm;

    formFieldHelpers: string = '';
    submitted: boolean = false;
    paymentFrequency = PaymentFrequency;
    paymentFrequencyOpts = Object.values(PaymentFrequency);

    errors: WritableSignal<FormError[]> = signal([]);
    $project = this.#projectService.selectedProject;
    $projectForm = computed(() => {
        const project = this.#projectService.selectedProject().data as Project;

        return this.#formBuilder.group({
            id: [project?.id ?? ''],
            name: [project?.name ?? '', [Validators.required]],
            type: [project?.type ?? '', [Validators.required]],
            status: [
                project?.status ?? ProjectStatus.PENDING,
                [Validators.required],
            ],
            ownerId: [project?.ownerId ?? ''],
            startDate: [project?.startDate ?? ''],
            endDate: [project?.endDate ?? ''],
            cost: [project?.cost ?? ''],
            description: [project?.description ?? ''],
            templateId: [project?.templateId ?? ''],
            details: this.#formBuilder.group({}),
        });
    });

    #templates$ = this.#templatesService.all<Template[]>({ perPage: 100 });
    $templates = toSignal(this.#templates$);

    $templateOpts = computed(() => {
        const templates = this.$templates()?.data as Template[];
        return templates
            ?.filter((t) => t.type === TemplateType.PROJECT)
            .map((t) => ({ id: t.id, name: t.name }));
    });

    $selectedTemplate: WritableSignal<Template | undefined> = signal(
        {} as Template
    );

    #users$ = this.#userService.getUsersWithRole('landlord,tenant').pipe(
        takeUntilDestroyed(),
        map((d) => d.data as User[]),
        catchError(() => of([] as User[]))
    );
    $owners = toSignal(this.#users$);

    $types = this.#metadataService.getComputedOptions(
        'type',
        MetadataEntityType.PROJECT
    );

    $statuses = this.#metadataService.getComputedOptions(
        'status',
        MetadataEntityType.PROJECT
    );

    constructor() {
        super();

        effect(
            () => {
                this.$projectForm()
                    .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((value) => this.onValuesChange(value));
            },
            { allowSignalWrites: true }
        );
        effect(
            () => {
                const project = this.#projectService.selectedProject()
                    .data as Project;
                project && this.onValuesChange(project);
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

    private getSelectedTemplate(templateId): Template | undefined {
        const templates = this.$templates()?.data as Template[];
        return templates?.find((t) => t.id === templateId);
    }

    onSubmitNewProject(projectForm: NgForm): void {
        this.submitted = true;
        projectForm.value.startDate = formatDate(
            projectForm.value.startDate,
            'yyyy-MM-dd',
            'en-US'
        );
        projectForm.value.endDate = formatDate(
            projectForm.value.endDate,
            'yyyy-MM-dd',
            'en-US'
        );

        const project = this.#projectService.selectedProject().data as Project;

        if (project?.id) {
            this.editProject(projectForm);
        } else {
            this.addProject(projectForm);
        }
    }

    private addProject(projectForm: NgForm): void {
        this.#projectService.storeProject(projectForm.value).subscribe({
            next: () => {
                this.#modalService.closeModal();
                this.#toastService.showToast(
                    TOAST_STATE.SUCCESS,
                    'Project added successfully!'
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

    private editProject(projectForm: NgForm): void {
        const project = this.#projectService.selectedProject().data as Project;
        this.#projectService
            .updateProject(project.id, projectForm.value)
            .subscribe({
                next: () => {
                    this.#toastService.showToast(
                        TOAST_STATE.SUCCESS,
                        'Project updated successfully!'
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
