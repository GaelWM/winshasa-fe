import { CommonModule } from '@angular/common';
import { Component, Signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { TemplatesService } from 'app/services/templates.service';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import { Template } from 'app/shared/models';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        JsonFormComponent,
    ],
    standalone: true,
})
export class PreviewComponent {
    private _templatesService = inject(TemplatesService);
    public matDialogRef = inject(MatDialogRef<PreviewComponent>);
    private fb = inject(FormBuilder);

    template: Signal<Template> = computed(() => {
        const temp = this._templatesService.selectedTemplate();
        return temp.data as Template;
    });
    templateForm: Signal<FormGroup> = computed(() => {
        return this.fb.group({
            details: this.fb.group({}),
        });
    });

    onCloseModal(event: Event): void {
        event.preventDefault();
        this.matDialogRef.close('modal closed');
    }

    onSubmitPreview(form: FormGroup): void {
        console.log('form--: ', form);
    }
}
