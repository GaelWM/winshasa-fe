import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UploadService } from 'app/services/upload.service';
import { finalize, Subscription, tap, catchError } from 'rxjs';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
    ],
    standalone: true,
})
export class FileUploadComponent implements OnInit {
    @Input() url: string;
    @Input() fileAttribute: string;
    @Input() requiredFileTypes: string[];
    @Input() multiple: boolean = false;

    @Output() uploaded: EventEmitter<{ res: any; error: any | boolean }> =
        new EventEmitter<{ res: any; error: any | boolean }>();

    fileName: string = '';
    uploadProgress: number;
    subscription: Subscription = new Subscription();

    constructor(private uploadService: UploadService) {}

    ngOnInit(): void {}

    onFileSelected(event: any): void {
        event.preventDefault();
        event.stopPropagation();
        const file: File = event.target.files[0];

        if (!this.requiredFileTypes.includes(file.type)) {
        }
        if (file && this.requiredFileTypes.includes(file.type)) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append(this.fileAttribute, file);

            const upload$ = this.uploadService.upload(formData).pipe(
                tap((res: any) =>
                    this.uploaded.emit({ res: res.body, error: false })
                ),
                finalize(() => this.reset()),
                catchError(async (error) =>
                    this.uploaded.emit({ res: false, error: error })
                )
            );

            const uploadSub = upload$.subscribe((_event: any) => {
                if (_event && _event.type === HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(
                        100 * (_event.loaded / _event.total)
                    );
                }
            });

            this.subscription.add(uploadSub);
        }
    }

    cancelUpload(): void {
        this.subscription.unsubscribe();
        this.reset();
    }

    reset(): void {
        this.uploadProgress = null;
        this.subscription = null;
    }
}
