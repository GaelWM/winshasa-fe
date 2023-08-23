import { CommonModule } from '@angular/common';
import {
    Component,
    DestroyRef,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { TemplatesService } from 'app/services/templates.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { FormError, Template } from 'app/shared/models';

@Component({
    selector: 'app-template-form',
    templateUrl: './template-form.component.html',
    styleUrls: ['./template-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule,
        FuseAlertComponent,
        ReactiveFormsModule,
        ErrorFormTemplateComponent,
    ],
})
export class TemplateFormComponent {
    private destroyRef = inject(DestroyRef);
    private _templateService = inject(TemplatesService);
    private _formBuilder = inject(FormBuilder);
    private dialogRef = inject(MatDialogRef<TemplateFormComponent>);
    private data = inject(MAT_DIALOG_DATA) as {
        title: string;
        template: Template;
        action: string;
    };

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);
    templateForm = computed(() => {
        const template = this.data.template;
        return this._formBuilder.group({
            id: [template?.id ?? ''],
            name: [
                template?.name ?? '',
                [Validators.required, Validators.minLength(3)],
            ],
            type: [template?.type ?? '', [Validators.required]],
            isActive: [template?.isActive ?? true],
            details: this._formBuilder.group({
                description: [template?.details?.description ?? ''],
            }),
        });
    });

    onSubmitNewTemplate(templateForm: NgForm): void {
        this.submitted = true;
        if (this.data.action === 'edit' && this.data.template.id) {
            this.editTemplate(templateForm.form.value);
        } else {
            this.addTemplate(templateForm.form.value);
        }
    }

    onCloseModal(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.dialogRef.close('modal closed');
    }

    private addTemplate(formValue: any): void {
        this._templateService
            .storeTemplate(formValue)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.dialogRef.close();
                },
                error: (err) => {
                    this.errors.set(err?.error?.errors);
                },
            });
    }

    private editTemplate(formValue: any): void {
        this._templateService
            .updateTemplate(this.data.template.id, formValue)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.dialogRef.close();
                },
                error: (err) => {
                    this.errors.set(err?.error?.errors);
                },
            });
    }
}
