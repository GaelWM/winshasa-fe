import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@app/services/alert.service';
import { FileManagerService } from '@app/services/file-manager.service';
import { FileManagerDirectory } from '@app/shared/models/file-manager.model';
import { Util } from '@app/utils/functions';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-folder-form',
    templateUrl: './folder-form.component.html',
    styleUrls: ['./folder-form.component.scss'],
})
export class FolderFormComponent implements OnInit, OnDestroy {
    subscription = new Subscription();
    folderForm: FormGroup;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string;
            folder: FileManagerDirectory;
            action: string;
        },
        public dialogRef: MatDialogRef<FolderFormComponent>,
        private _fileManagerService: FileManagerService,
        private _alertService: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.folderForm = this.formBuilder.group({
            name: [
                (this.data && this.data.folder && this.data.folder.dirname) ??
                    '',
            ],
            path: [
                (this.data && this.data.folder && this.data.folder.path) ?? '',
            ],
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmitFolder(folder: FileManagerDirectory): void {
        this._fileManagerService.createDirectory(folder).subscribe({
            next: () => {
                this.dialogRef.close();
                this._alertService.add({
                    type: 'success',
                    title: 'Success',
                    message: 'Site has been successfully created',
                });
            },
            error: (err) => {
                this._alertService.add({
                    type: 'error',
                    title: 'Error',
                    message: Util.getBackendErrors(err.error),
                });
            },
        });
    }

    onCloseModal(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.dialogRef.close('modal closed');
        this.subscription.unsubscribe();
    }
}
