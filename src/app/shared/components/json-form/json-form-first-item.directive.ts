import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[jsonFormFirstCol]' })
export class JsonFormFirstColDirective {
    constructor(
        readonly tpl: TemplateRef<any>,
        public viewContainerRef: ViewContainerRef
    ) {}
}
