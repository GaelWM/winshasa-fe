import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Signal,
    ViewChild,
    ViewEncapsulation,
    computed,
    inject,
} from '@angular/core';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'template-add-field',
    templateUrl: './add-template-field.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        TextFieldModule,
    ],
    standalone: true,
})
export class TemplateAddFieldComponent {
    @ViewChild('titleInput') titleInput: ElementRef;
    @ViewChild('titleAutosize') titleAutosize: CdkTextareaAutosize;
    @Input() buttonTitle: string = 'Add a field';
    @Output() readonly saved: EventEmitter<string> = new EventEmitter<string>();

    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _formBuilder = inject(UntypedFormBuilder);

    formVisible: boolean = false;
    form: Signal<UntypedFormGroup> = computed(() => {
        return this._formBuilder.group({
            title: [''],
        });
    });

    save(): void {
        // Get the new list title
        const title = this.form().get('title').value;

        // Return, if the title is empty
        if (!title || title.trim() === '') {
            return;
        }

        // Execute the observable
        this.saved.next(title.trim());

        // Clear the new list title and hide the form
        this.formVisible = false;
        this.form().get('title').setValue('');

        // Reset the size of the textarea
        setTimeout(() => {
            this.titleInput.nativeElement.value = '';
            this.titleAutosize.reset();
        });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    toggleFormVisibility(): void {
        // Toggle the visibility
        this.formVisible = !this.formVisible;

        // If the form becomes visible, focus on the title field
        if (this.formVisible) {
            this.titleInput.nativeElement.focus();
        }
    }
}
