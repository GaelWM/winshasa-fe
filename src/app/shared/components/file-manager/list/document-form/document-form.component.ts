import { CommonModule } from '@angular/common';
import {
    Component,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MetadataService } from 'app/services/metadata.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { FormError, Metadata } from 'app/shared/models';
import { DocumentOwnerType, DocumentStatus } from '../../file-manager.types';
import { FileManagerService } from '../../file-manager.service';

@Component({
    selector: 'app-document-form',
    templateUrl: './document-form.component.html',
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
        FuseAlertComponent,
        ErrorFormTemplateComponent,
    ],
    standalone: true,
})
export class DocumentFormComponent {
    public data = inject(MAT_DIALOG_DATA) as {
        title: string;
        ownerId?: string;
        ownerType?: DocumentOwnerType;
        folderId?: string;
        action: string;
    };
    public dialogRef = inject(MatDialogRef<DocumentFormComponent>);
    private _metadataService = inject(MetadataService);
    private _formBuilder = inject(FormBuilder);
    #fileManagerService = inject(FileManagerService);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);
    selectedFile: File | null = null;

    folderOptions = computed(() => {
        const folders = this.#fileManagerService.getRawItems().folders;
        return folders.map((folder) => ({
            name: folder.name,
            id: folder.id,
        }));
    });

    documentForm = computed(() => {
        const folderId = this.data.folderId;
        const ownerId = this.data.ownerId;
        const ownerType = this.data.ownerType;

        return this._formBuilder.group({
            name: [''],
            ownerId: [ownerId ?? undefined],
            ownerType: [ownerType ?? undefined],
            folderId: [folderId ?? undefined],
            file: [null],
            status: [DocumentStatus.ACTIVE],
            details: this._formBuilder.group({
                description: [''],
            }),
        });
    });

    metadata$ = this._metadataService.all<Metadata[]>({ perPage: 100 });
    metadata = toSignal(this.metadata$);

    onSelectedFile(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        this.selectedFile = files.item(0);
    }

    onSubmitDocument(documentForm: NgForm): void {
        this.submitted = true;
        if (documentForm.invalid) {
            return;
        }

        const formValue = documentForm.value;
        this.#fileManagerService
            .uploadDocument(
                this.data.action === 'upload' ? 'FILE' : 'FOLDER',
                this.selectedFile,
                formValue.name,
                formValue.folderId,
                formValue.ownerId,
                formValue.ownerType
            )
            .subscribe({
                next: (res) => {
                    const items = this.#fileManagerService.getRawItems();
                    if (this.data.action === 'upload') {
                        this.#fileManagerService.setItems({
                            ...items,
                            files: [...items.files, res.data],
                        });
                    } else {
                        this.#fileManagerService.setItems({
                            ...items,
                            folders: [...items.folders, res.data],
                        });
                    }
                    this.dialogRef.close();
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

    onCloseModal(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.dialogRef.close('modal closed');
    }
}
