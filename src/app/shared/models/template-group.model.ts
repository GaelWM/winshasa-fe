import { TemplateGroupField } from './template-group-field.model';
import { v4 as uuidv4 } from 'uuid';
export interface ITemplateGroup {
    id?: string;
    name: string;
    fields?: TemplateGroupField[];
}

export class TemplateGroup implements ITemplateGroup {
    id: string;
    name: string;
    fields?: TemplateGroupField[];

    constructor(templateGroup: ITemplateGroup) {
        this.id = templateGroup.id ?? uuidv4();
        this.name = templateGroup.name;
        this.fields = templateGroup.fields;
    }

    toJson(): { [key: string]: any } {
        return {
            id: this.id,
            name: this.name,
            fields: this.fields?.map((tgf) => tgf.toJson()),
        };
    }
}
