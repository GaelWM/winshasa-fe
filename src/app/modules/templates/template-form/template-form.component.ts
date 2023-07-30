import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
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
import { TemplatesService } from 'app/services/templates.service';
import { ApiResult, Template } from 'app/shared/models';

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
        ReactiveFormsModule,
    ],
})
export class TemplateFormComponent implements OnInit {
    formFieldHelpers: string = '';
    submitted: boolean = false;
    templateForm = this._formBuilder.group({
        name: ['', [Validators.required]],
        type: ['', [Validators.required]],
        details: this._formBuilder.group({
            expandAllGroups: [false],
            uiClassesOverride: [''],
            uiSettings: this._formBuilder.group({
                gridType: [''],
                gridFlow: [''],
                noGridType: [undefined],
            }),
        }),
    });
    errorMessage: string = '';

    private destroyRef = inject(DestroyRef);

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { title: string; template: Template; action: string },
        public dialogRef: MatDialogRef<TemplateFormComponent>,
        private _templateService: TemplatesService,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        if (this.data.template) {
            this.templateForm.setValue({
                name: this.data.template.name,
                type: this.data.template.type,
                details: {
                    expandAllGroups:
                        this.data.template.details?.expandAllGroups ?? false,
                    uiClassesOverride:
                        this.data.template.details?.uiClassesOverride ?? '',
                    uiSettings: {
                        gridType:
                            this.data.template.details?.uiSettings?.gridType ??
                            '',
                        gridFlow:
                            this.data.template.details?.uiSettings?.gridFlow ??
                            '',
                        noGridType:
                            this.data.template.details?.uiSettings
                                ?.noGridType ?? '',
                    },
                },
            });
        }
    }

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
            .post<Template>(formValue)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: ApiResult<Template>) => {
                    if (response) {
                        this._templateService.updateUponCreate(
                            response.data as Template
                        );
                        this.dialogRef.close();
                    }
                },
                error: (error) => {
                    console.log('error: ', error.error.errors);
                    this.errorMessage =
                        error.error.errors &&
                        error.error.errors
                            .map((e: any) => {
                                return e.message;
                            })
                            .join('\n ');
                    console.log('this.errorMessage: ', this.errorMessage);
                },
            });
    }

    private editTemplate(formValue: any): void {
        this._templateService
            .put<Template>(this.data.template.id, formValue)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: ApiResult<Template>) => {
                    if (response) {
                        this._templateService.updateUponSave(
                            response.data as Template
                        );
                        this.dialogRef.close();
                    }
                },
                error: (error) => {
                    this.errorMessage =
                        error.error.errors &&
                        error.error.errors
                            .map((e: any) => {
                                return e.message;
                            })
                            .join('\n ');
                },
            });
    }
}
