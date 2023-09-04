import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateGroupField } from 'app/shared/models/template-group-field.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';

@Component({
    selector: 'app-number-field',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        ErrorFormTemplateComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './number-field.component.html',
})
export class NumberFieldComponent {
    @Input({ required: true }) field: TemplateGroupField;
    @Input({ required: true }) form: FormGroup<any> = {} as FormGroup<any>;
}
