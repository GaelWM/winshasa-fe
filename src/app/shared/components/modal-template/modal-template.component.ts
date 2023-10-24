import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    DestroyRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { ModalTemplateService } from './modal-template.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export abstract class WinFormBuilder {
    abstract form: NgForm;
}

@Component({
    selector: 'app-modal-template',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
    templateUrl: './modal-template.component.html',
    styleUrls: ['./modal-template.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ModalTemplateComponent implements OnInit {
    dialogRef = inject(MatDialogRef<ModalTemplateComponent>);
    data = inject(MAT_DIALOG_DATA) as {
        form: any;
        inputs: any;
        title: string;
        showCloseButton?: boolean;
    };
    #cfr = inject(ComponentFactoryResolver);
    #modalService = inject(ModalTemplateService);
    formComponent: ComponentRef<WinFormBuilder>;
    #destroyRef = inject(DestroyRef);

    @ViewChild('contentContainer', { read: ViewContainerRef, static: true })
    contentContainer: ViewContainerRef;

    constructor() {
        this.#modalService
            .closeModal$()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.dialogRef.close('modal closed');
            });
    }

    ngOnInit() {
        if (this.data.form !== undefined && this.data.form !== null) {
            this.formComponent = this.loadComponent(
                this.contentContainer,
                this.data.form
            );
        }
    }

    onCloseModal(event: Event): void {
        event.preventDefault();
        this.dialogRef.close('modal closed');
    }

    onSubmitClick(event: Event): void {
        event.preventDefault();
        this.formComponent?.instance?.form.ngSubmit.emit();
    }

    public loadComponent<T>(
        vcr: ViewContainerRef,
        componentToCreate: any
    ): ComponentRef<any> | undefined {
        vcr.clear();
        const factory = this.#cfr.resolveComponentFactory<T>(componentToCreate);
        const component = vcr.createComponent<T>(factory);
        if (this.data?.inputs) {
            Object.keys(this.data.inputs).forEach((key) => {
                component.instance[key] = this.data.inputs[key];
            });
        }
        return component;
    }
}
