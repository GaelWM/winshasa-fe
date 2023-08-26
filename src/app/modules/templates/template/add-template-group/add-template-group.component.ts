import { CommonModule } from '@angular/common';
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
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'template-add-group',
    templateUrl: './add-template-group.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
    ],
    standalone: true,
})
export class TemplateAddGroupComponent {
    @ViewChild('titleInput') titleInput: ElementRef;
    @Input() buttonTitle: string = 'Add a group';
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
        this.form().get('title').setValue('');
        this.formVisible = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle the visibility of the form
     */
    toggleFormVisibility(): void {
        // Toggle the visibility
        this.formVisible = !this.formVisible;

        // If the form becomes visible, focus on the title field
        if (this.formVisible) {
            this.titleInput.nativeElement.focus();
        }
    }
}
