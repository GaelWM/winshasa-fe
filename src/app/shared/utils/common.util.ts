import { WritableSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export function connectSignal<T>(
    $signal: WritableSignal<T>,
    obs$: Observable<T>
): void {
    obs$.pipe(takeUntilDestroyed()).subscribe((result) => $signal.set(result));
}

export function toWritableSignal<T>(
    obs$: Observable<T>,
    initialValue: T
): WritableSignal<T> {
    const $signal = signal<T>(initialValue as T);
    connectSignal($signal, obs$);
    return $signal;
}
