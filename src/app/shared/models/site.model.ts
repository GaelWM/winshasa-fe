/* eslint-disable @typescript-eslint/naming-convention */
import { Type } from './type.model';
import { Category } from './category.model';
import { Status } from './status.model';
import { Template } from './template.model';
import { DocModel } from './file-manager.model';

export class Site {
    id: number;
    slug: string;
    name: string;
    type: Type;
    status: Status;
    category?: Category;
    latitude?: number;
    longitude?: number;
    template_id: number;
    status_id: number;
    type_id: number;
    category_id: number;
    template: Template;
    details?: {
        name: string;
        type: string;
        category: string;
    };
    documentation?: DocModel;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;

    constructor(model: any) {
        this.id = model.id;
        this.slug = model.slug;
        this.name = model.name;
        this.type = model.type;
        this.category = model.category;
        this.status = model.status;
        this.latitude = model.latitude;
        this.longitude = model.longitude;
        this.details = model.details;
        this.template = model.template;
        this.template_id = model.template_id;
        this.status_id = model.status_id;
        this.type_id = model.type_id;
        this.category_id = model.category_id;
        this.createdAt = model.created_at;
        this.createdBy = model.created_by;
        this.updatedAt = model.updated_at;
        this.updatedBy = model.updated_by;
        this.deletedAt = model.deleted_at;
        this.deletedBy = model.deleted_by;
    }
}

export const SITE_MODEL_TYPE = 'App\\Models\\Site';
