import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FieldType,
    TemplateGroupField,
} from 'app/shared/models/template-group-field.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

@Component({
    selector: 'app-text-field',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        ErrorFormTemplateComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './text-field.component.html',
})
export class TextFieldComponent {
    @Input({ required: true }) formControl: FormControl;
    @Input({ required: true }) field: TemplateGroupField;
    @Input({ required: true }) form: FormGroup<any> = {} as FormGroup<any>;
    isTextField(type: FieldType): boolean {
        return TemplateGroupField.isTextField(type);
    }
}
