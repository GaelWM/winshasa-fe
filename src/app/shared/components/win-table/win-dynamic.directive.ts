import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnInit,
} from '@angular/core';

@Directive({
    selector: '[winDynamicDirective]',
})
export class WinDynamicDirective implements OnInit, AfterViewInit {
    @Input() winDynamicDirective: any;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {}

    ngAfterViewInit() {
        if (this.winDynamicDirective) {
            const directive = new this.winDynamicDirective(this.elementRef);
            directive.ngOnInit();
        }
    }
}
