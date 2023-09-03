import { TemplateGroup } from './template-group.model';

export interface ITemplate {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    details?: TemplateDetails;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export class Template implements ITemplate {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    details?: TemplateDetails;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;

    constructor(template: ITemplate) {
        this.id = template.id;
        this.name = template.name;
        this.type = template.type;
        this.details = template.details;
        this.createdAt = template.createdAt;
        this.createdBy = template.createdBy;
        this.updatedAt = template.updatedAt;
        this.updatedBy = template.updatedBy;
    }

    toJson(): { [key: string]: any } {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            details: this.details,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy,
        };
    }
}

export type TemplateDetails = {
    groups?: TemplateGroup[];
    description?: string;
    settings?: {
        expandAllGroups?: boolean;
        gridType?: 'rows' | 'cols';
        gridFlow?: 'row' | 'col';
        numberOfGrids?: number;
        uiClassesOverride?: string;
    };
};
