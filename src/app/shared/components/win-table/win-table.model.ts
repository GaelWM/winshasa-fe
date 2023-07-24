import { TemplateRef } from "@angular/core";
export interface DynamicPipeModel {
    obj: any;
    constructor?: any;
}
export class ColumnSetting {
    title!: string;
    key!: string;
    divider?: boolean;
    sortKey?: string;
    clickEvent?: boolean = false;
    pipe?: { class: DynamicPipeModel; args?: any };
    directive?: any;
    style?: string;
    customClass?: string;
    safeHtml?: boolean;
    template?: TemplateRef<any>;
}
  