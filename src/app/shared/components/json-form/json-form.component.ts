import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { JsonFormFirstColDirective } from './json-form-first-item.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTimepickerModule } from 'mat-timepicker';
import { Template } from 'app/shared/models';
import {
    ValidationPattern,
    REGEX_PATTERNS,
    FieldType,
} from 'app/shared/models/template-group-field.model';

import { TemplateGroupField } from 'app/shared/models/template-group-field.model';
import { TextFieldComponent } from './controls/text-field/text-field.component';
import { NumberFieldComponent } from './controls/number-field/number-field.component';

export interface JsonFormData {
    controls: TemplateGroupField[];
}

@Component({
    selector: 'app-json-form',
    templateUrl: './json-form.component.html',
    styleUrls: ['./json-form.component.scss'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
        MatDialogModule,
        MatOptionModule,
        MatDividerModule,
        MatRadioModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatChipsModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatTimepickerModule,

        TextFieldComponent,
        NumberFieldComponent,
    ],
    standalone: true,
})
export class JsonFormComponent implements OnChanges {
    private fb = inject(FormBuilder);

    @ContentChild(JsonFormFirstColDirective)
    firstCol!: JsonFormFirstColDirective;
    @Input() template: Template;
    @Input() form: FormGroup;
    @Input() formClass?: string;
    @Input() formGroupClass?: string;
    @Input() values: any;
    @Output() submitted: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();

    containerClass?: string = 'md:grid-cols-3 grid-flow-row';

    allPatterns: ValidationPattern[] = REGEX_PATTERNS;

    ngOnChanges(): void {
        if (this.template != null) {
            const controls = this.template?.details?.groups?.map(
                (group) => group.fields
            );

            const merged = controls.flat(1);
            merged.map((control) => {
                control.value = this.values?.details?.[control.name]
                    ? this.values.details[control.name]
                    : null;
                return control;
            });
            this.createForm(merged);
        }
    }

    createForm(controls: TemplateGroupField[]): void {
        for (const control of controls) {
            const validatorsToAdd = [];
            if (control.validators) {
                for (const [key, value] of Object.entries(control.validators)) {
                    if (!value) {
                        continue;
                    }
                    switch (key) {
                        case 'min':
                            validatorsToAdd.push(Validators.min(value));
                            break;
                        case 'max':
                            validatorsToAdd.push(Validators.max(value));
                            break;
                        case 'required':
                            validatorsToAdd.push(Validators.required);
                            break;
                        case 'requiredTrue':
                            validatorsToAdd.push(Validators.requiredTrue);
                            break;
                        case 'email':
                            validatorsToAdd.push(Validators.email);
                            break;
                        case 'minLength':
                            validatorsToAdd.push(Validators.minLength(value));
                            break;
                        case 'maxLength':
                            validatorsToAdd.push(Validators.maxLength(value));
                            break;
                        case 'pattern':
                            validatorsToAdd.push(
                                Validators.pattern(
                                    this.getPatternWithName(value)
                                )
                            );
                            break;
                        case 'nullValidator':
                            validatorsToAdd.push(Validators.nullValidator);
                            break;
                        default:
                            break;
                    }
                }
            }

            if (control.type === FieldType.Time) {
                control.value = new Date(control.value);
            }
            if (control.type === FieldType.Slider) {
                console.log('control: ', control);
            }
            if (control.type === FieldType.DateRange) {
                const group = this.form.get('details') as FormGroup;
                group.addControl(
                    control.name,
                    this.fb.group({
                        start: control.value && control.value['start'],
                        end: control.value && control.value['end'],
                    })
                );
            } else {
                const group = this.form.get('details') as FormGroup;
                group.addControl(
                    control.name,
                    this.fb.control(control.value, validatorsToAdd)
                );
            }
        }
    }

    onSubmit(form: FormGroup): void {
        this.submitted.emit(form);
    }

    getPatternWithName(name: string): string {
        return (
            this.allPatterns.find((p) => p.name.trim() === name.trim())
                ?.value ?? ''
        );
    }

    getPatternName(pattern: string): string {
        return (
            this.allPatterns.find((p) => p.value + '$' === pattern)?.name ?? ''
        );
    }

    formatSliderLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }
        return `${value}`;
    }

    isTextField(type: FieldType): boolean {
        return TemplateGroupField.isTextField(type);
    }
}
