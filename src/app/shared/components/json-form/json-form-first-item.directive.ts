import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[jsonFormFirstCol]', standalone: true })
export class JsonFormFirstColDirective {
    constructor(
        readonly tpl: TemplateRef<any>,
        public viewContainerRef: ViewContainerRef
    ) {}
}
