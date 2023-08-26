import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { REGEX_PATTERNS } from 'app/shared/models/template-group-field.model';

@Component({
    selector: 'app-error-form-template',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule],
    templateUrl: './error-form-template.component.html',
})
export class ErrorFormTemplateComponent {
    @Input({ required: true }) field: string = '';
    @Input({ required: true }) form: FormGroup<any> = {} as FormGroup<any>;
    @Input() name?: string;

    getPatternName(pattern: string): string {
        return (
            REGEX_PATTERNS.find((p) => p.value + '$' === pattern)?.name ?? ''
        );
    }
}
