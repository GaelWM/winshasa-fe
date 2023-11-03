import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { ToastService } from './toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, FuseAlertComponent],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    animations: [
        trigger('toastTrigger', [
            // This refers to the @trigger we created in the template
            state('open', style({ transform: 'translateY(0%)' })), // This is how the 'open' state is styled
            state('close', style({ transform: 'translateY(-200%)' })), // This is how the 'close' state is styled
            transition('open <=> close', [
                // This is how they're expected to transition from one to the other
                animate('300ms ease-in-out'),
            ]),
        ]),
    ],
})
export class ToastComponent implements OnInit {
    toastService = inject(ToastService);
    #destroyRef = inject(DestroyRef);

    toastClass: string[];
    toastMessage: string;
    showsToast: boolean = false;

    title: string;

    dismiss(): void {
        this.toastService.dismissToast();
    }

    ngOnInit(): void {
        this.toastService.toastState$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((toastState) => {
                setTimeout(() => {
                    this.toastService.dismissToast();
                }, 5000);

                if (toastState === 'success') {
                    this.title = 'Success!';
                }

                if (toastState === 'error') {
                    this.title = 'Error!';
                }

                if (toastState === 'warning') {
                    this.title = 'Warning!';
                }

                if (toastState === 'info') {
                    this.title = 'Info!';
                }
            });
    }

    onDismiss(event: boolean): void {
        console.log('event: ', event);
        this.toastService.dismissToast();
    }
}
