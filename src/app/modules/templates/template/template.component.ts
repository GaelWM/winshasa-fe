import {
    CdkDragDrop,
    DragDropModule,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Signal,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PreviewComponent } from './preview/preview.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiResult, Template } from 'app/shared/models';
import { TemplatesService } from 'app/services/templates.service';
import { TemplateGroup } from 'app/shared/models/template-group.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TemplateAddGroupComponent } from './add-template-group/add-template-group.component';
import { TemplateAddFieldComponent } from './add-template-field/add-template-field.component';
import {
    FieldType,
    TemplateGroupField,
} from 'app/shared/models/template-group-field.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable, tap, switchMap, catchError, of, filter, map } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { TemplateFieldFormComponent } from '../template-field-form/template-field-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterModule,
        TemplateAddGroupComponent,
        TemplateAddFieldComponent,
        DragDropModule,
        ReactiveFormsModule,
        MatMenuModule,
        TemplateFieldFormComponent,
        MatButtonModule,
        MatTooltipModule,
    ],
    standalone: true,
})
export class TemplateComponent {
    private _formBuilder = inject(UntypedFormBuilder);
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private _templateService = inject(TemplatesService);
    private _matDialog = inject(MatDialog);
    private destroyRef = inject(DestroyRef);
    private _route = inject(ActivatedRoute);
    private _router = inject(Router);

    private readonly _positionStep: number = 65536;
    private readonly _maxTemplateGroupCount: number = 200;
    private readonly _maxPosition: number = this._positionStep * 500;

    private template$: Observable<ApiResult<Template>> =
        this._route.params.pipe(
            switchMap((params) =>
                this._templateService.get<Template>(params['id'])
            ),
            tap((template: ApiResult<Template>) => {
                if (template) {
                    this._templateService.selectedTemplate.set(template);
                }
            }),
            catchError(() => of(undefined)),
            takeUntilDestroyed()
        );
    temp = toSignal(this.template$, {
        initialValue: {} as ApiResult<Template>,
    });

    template = signal({} as ApiResult<Template>);

    constructor() {
        effect(() => {
            this.temp();
            this.template = this._templateService.selectedTemplate;
        });

        this._route.queryParams
            .pipe(
                map((queryParams) => {
                    const groupId = queryParams.groupId;
                    const fieldId = queryParams.fieldId;
                    return { groupId, fieldId };
                }),
                filter(({ groupId, fieldId }) => groupId && fieldId),
                tap(({ groupId, fieldId }) => {
                    this._matDialog
                        .open(TemplateFieldFormComponent, {
                            autoFocus: false,
                            data: {
                                title: 'Edit field',
                                action: 'edit',
                                groupId,
                                fieldId,
                            },
                        })
                        .afterClosed()
                        .subscribe(() => {
                            this._router.navigate([], {
                                queryParams: undefined,
                                relativeTo: this._route,
                            });
                        });
                }),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    templateGroupTitleForm: Signal<UntypedFormGroup> = computed(() => {
        return this._formBuilder.group({
            title: [''],
        });
    });

    /**
     * Focus on the given element to start editing the templateGroup title
     *
     * @param templateGroupTitleInput
     */
    renameTemplateGroup(templateGroupTitleInput: HTMLElement): void {
        // Use timeout so it can wait for menu to close
        setTimeout(() => {
            templateGroupTitleInput.focus();
        });
    }

    /**
     * Add new template group
     *
     * @param name
     */
    addTemplateGroup(name: string): void {
        // Limit the max template  group count
        if (
            (this.template().data as Template)?.details?.groups &&
            (this.template().data as Template)?.details?.groups.length >=
                this._maxTemplateGroupCount
        ) {
            return;
        }

        // Create a new template group model
        const templateGroup = new TemplateGroup({ name: name });

        // Save the template group
        this._templateService
            .createTemplateGroup(
                (this.template().data as Template).id,
                templateGroup
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    /**
     * Update the template group title
     *
     * @param event
     * @param templateGroup
     */
    updateTemplateGroupTitle(event: any, templateGroup: TemplateGroup): void {
        // Get the target element
        const element: HTMLInputElement = event.target;

        // Get the new title
        const newTitle = element.value.trim();

        // If the title is empty...
        if (!newTitle || newTitle === '' || newTitle === templateGroup.name) {
            // Reset to original title and return
            element.value = templateGroup.name;
            return;
        }

        // Update the templateGroup title and element value
        templateGroup.name = element.value = newTitle;

        // Update the templateGroup
        this._templateService
            .updateTemplateGroup(
                (this.template().data as Template).id,
                templateGroup
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    /**
     * Delete the template group
     *
     * @param templateGroupId
     */
    deleteTemplateGroup(templateGroup: TemplateGroup): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete template group',
            message:
                'Are you sure you want to delete this group and its fields? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // Delete the template group
                this._templateService
                    .deleteTemplateGroup(
                        (this.template().data as Template).id,
                        templateGroup.id
                    )
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
            }
        });
    }

    /**
     * Add new template group field
     *
     * @param templateGroup
     * @param name
     *
     * @returns void
     *
     * @memberof TemplateComponent
     */
    addTemplateGroupField(templateGroup: TemplateGroup, name: string): void {
        // Create a new template group field model
        const templateGroupField = new TemplateGroupField({
            name: name,
            value: '',
            required: false,
            type: FieldType.Text,
        });

        // Save the template group field
        this._templateService
            .createTemplateGroupField(
                (this.template().data as Template).id,
                templateGroup.id,
                templateGroupField
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    /**
     * Delete template group field
     *
     * @param event
     * @param field
     *
     */
    onDeleteTemplateGroupField(
        event: Event,
        templateGroup: TemplateGroup,
        field: TemplateGroupField
    ): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete template group field',
            message:
                'Are you sure you want to delete this field? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Delete the templateGroup
                this._templateService
                    .deleteTemplateGroupField(
                        (this.template().data as Template).id,
                        templateGroup.id,
                        field.id
                    )
                    .subscribe();
            }
        });
    }

    /**
     * Preview template
     */
    onPreviewTemplate(): void {
        this._matDialog.open(PreviewComponent);
    }

    /**
     * template group dropped
     *
     * @param event
     */
    templateGroupDropped(event: CdkDragDrop<TemplateGroup[]>): void {
        // Move the item
        moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );

        // Calculate the positions
        const updated = this._calculatePositions(event);

        if (event.currentIndex !== event.previousIndex) {
            // Update the templateGroups
            this._templateService
                .updateTemplateGroupsOrder(
                    (this.template().data as Template).id,
                    updated
                )
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
    }

    /**
     * TemplateGroupField dropped
     *
     * @param event
     */
    templateGroupFieldDropped(event: CdkDragDrop<TemplateGroupField[]>): void {
        // Move or transfer the item
        if (event.previousContainer === event.container) {
            // Move the item
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            // Transfer the item
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            // Update the templateGroupField's templateGroup it
            // event.container.data[event.currentIndex].group.id =
            //     event.container.id;
        }

        const landedGroup = (
            this.template().data as Template
        )?.details?.groups?.find((g) => g.id === event.container.id);

        // Calculate the positions
        const updated = this._calculatePositions(event);

        // Update the templateGroupFields
        if (
            !(
                event.previousContainer.id === event.container.id &&
                event.previousIndex === event.currentIndex
            )
        ) {
            this._templateService
                .updateTemplateGroupFieldsOrder(
                    (this.template().data as Template).id,
                    landedGroup.id,
                    updated
                )
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Calculate and set item positions
     * from given CdkDragDrop event
     *
     * @param event
     * @private
     */
    private _calculatePositions(event: CdkDragDrop<any[]>): any[] {
        // Get the items
        let items = event.container.data;
        const currentItem = items[event.currentIndex];
        const prevItem = items[event.currentIndex - 1] || null;
        const nextItem = items[event.currentIndex + 1] || null;

        // If the item moved to the top...
        if (!prevItem) {
            // If the item moved to an empty container
            if (!nextItem) {
                currentItem.position = this._positionStep;
            } else {
                currentItem.position = nextItem.position / 2;
            }
        }
        // If the item moved to the bottom...
        else if (!nextItem) {
            currentItem.position = prevItem.position + this._positionStep;
        }
        // If the item moved in between other items...
        else {
            currentItem.position = (prevItem.position + nextItem.position) / 2;
        }

        // Check if all item positions need to be updated
        if (
            !Number.isInteger(currentItem.position) ||
            currentItem.position >= this._maxPosition
        ) {
            // Re-calculate all orders
            items = items.map((value, index) => {
                value.position = (index + 1) * this._positionStep;
                return value;
            });

            // Return items
            return items;
        }

        // Return currentItem
        return [currentItem];
    }
}
