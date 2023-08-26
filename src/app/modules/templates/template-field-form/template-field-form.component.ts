import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
    computed,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TemplatesService } from 'app/services/templates.service';
import { ApiResult } from 'app/shared/models';
import {
    FieldType,
    REGEX_PATTERNS,
    TemplateGroupField,
    ValidationPattern,
    fieldOptions,
} from 'app/shared/models/template-group-field.model';
import { Template } from 'app/shared/models/template.model';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'template-field-form',
    templateUrl: './template-field-form.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDividerModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatChipsModule,
    ],
    standalone: true,
})
export class TemplateFieldFormComponent {
    public data = inject(MAT_DIALOG_DATA) as {
        title: string;
        groupId: string;
        fieldId: string;
    };
    public matDialogRef = inject(MatDialogRef<TemplateFieldFormComponent>);
    private _templateService = inject(TemplatesService);
    private formBuilder = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);

    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    fieldOptions = fieldOptions;
    showOptions: boolean = false;
    showSliderOptions: boolean = false;
    showLabelPosition: boolean = false;
    showMinMaxValidation: boolean = false;
    isTextField: boolean = false;
    controlWithOptions: Array<FieldType> = [
        FieldType.Select,
        FieldType.MultiSelect,
        FieldType.Radio,
        FieldType.AutoComplete,
        FieldType.MultiAutoComplete,
    ];
    controlWithLabelPosition: Array<FieldType> = [
        FieldType.Checkbox,
        FieldType.Radio,
    ];
    allPatterns: ValidationPattern[] = REGEX_PATTERNS;

    fieldForm = computed(() => {
        const selectedTemplate = (
            this._templateService.selectedTemplate() as ApiResult<Template>
        ).data as Template;
        const field = selectedTemplate?.details?.groups
            ?.find((g) => g.id === this.data.groupId)
            ?.fields?.find((f) => f.id === this.data.fieldId);

        const form = this.formBuilder.group({
            id: [field?.id ?? ''],
            name: [
                field?.name ?? '',
                [Validators.required, Validators.minLength(1)],
            ],
            type: [field?.type ?? 'text', Validators.required],
            options: [field?.options ?? ''],
            hasValidators: [field?.hasValidators ?? false],
            labelPosition: [field?.labelPosition ?? ''],
            sliderOptions: this.formBuilder.group({
                min: [field?.sliderOptions?.min ?? ''],
                max: [field?.sliderOptions?.max ?? ''],
                step: [field?.sliderOptions?.step ?? ''],
                showTicks: [field?.sliderOptions?.showTicks ?? false],
                thumbLabel: [field?.sliderOptions?.thumbLabel ?? false],
                disabled: [field?.sliderOptions?.disabled ?? false],
            }),
            validators: this.formBuilder.group({
                required: [field?.validators?.required ?? false],
                min: [field?.validators?.min ?? '', [Validators.min]],
                max: [field?.validators?.max, [Validators.max]],
                email: [field?.validators?.email ?? false],
                minLength: [Validators.minLength],
                maxLength: [Validators.maxLength],
                pattern: [field?.validators?.pattern ?? ''],
                nullValidator: [field?.validators?.nullValidator ?? ''],
            }),
        });
        this.onChangeMethods(field);
        return form;
    });

    constructor() {
        this.fieldForm()
            .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((field) => {
                this.onChangeMethods(field);
            });
    }

    onSubmitField(fieldForm: NgForm): void {
        const templateId = (
            (this._templateService.selectedTemplate() as ApiResult<Template>)
                .data as Template
        ).id;
        this._templateService
            .updateTemplateGroupField(
                templateId,
                this.data.groupId,
                fieldForm.value
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.matDialogRef.close();
            });
    }

    onCloseModal(event: Event): void {
        event.preventDefault();
        this.matDialogRef.close('modal closed');
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private onChangeMethods(field: any): void {
        this.showOptions = this.controlWithOptions.includes(
            field?.type as FieldType
        );

        this.showSliderOptions = field?.type === FieldType.Slider;

        this.showLabelPosition = this.controlWithLabelPosition.includes(
            field?.type as FieldType
        );

        this.showMinMaxValidation = field?.type === FieldType.Number;

        this.isTextField = TemplateGroupField.isTextField(field?.type);
    }
}
