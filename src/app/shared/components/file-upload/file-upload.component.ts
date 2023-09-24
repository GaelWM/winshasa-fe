import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    Output,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from 'environments/environment';
import { finalize, tap, catchError } from 'rxjs';

const baseUrl = environment.apiBaseUrl;
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
export class FileUploadComponent {
    @Input() url: string;
    @Input() fileAttribute: string;
    @Input() requiredFileTypes: string[];
    @Input() multiple: boolean = false;
    @Input() additionalFormData: Record<string, string> = {};

    @Output() uploaded: EventEmitter<{ res: any; error: any | boolean }> =
        new EventEmitter<{ res: any; error: any | boolean }>();

    fileName: string = '';
    uploadProgress: number;

    #destroyRef = inject(DestroyRef);
    #http = inject(HttpClient);

    onFileSelected(event: any): void {
        event.preventDefault();
        event.stopPropagation();
        const file: File = event.target.files[0];

        if (file && this.requiredFileTypes.includes(file.type)) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append(this.fileAttribute, file);
            Object.keys(this.additionalFormData).forEach((key) => {
                formData.append(key, this.additionalFormData[key]);
            });
            const upload$ = this.#http
                .put(`${baseUrl}${this.url}`, formData)
                .pipe(
                    tap((res: any) =>
                        this.uploaded.emit({ res: res.data, error: false })
                    ),
                    finalize(() => this.reset()),
                    catchError(async (error) =>
                        this.uploaded.emit({ res: false, error: error })
                    ),
                    takeUntilDestroyed(this.#destroyRef)
                );

            upload$
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe((_event: any) => {
                    if (
                        _event &&
                        _event.type === HttpEventType.UploadProgress
                    ) {
                        this.uploadProgress = Math.round(
                            100 * (_event.loaded / _event.total)
                        );
                    }
                });
        } else {
            this.uploaded.emit({
                res: false,
                error: 'File type not supported',
            });
        }
    }

    cancelUpload(): void {
        this.reset();
    }

    reset(): void {
        this.uploadProgress = null;
    }
}
