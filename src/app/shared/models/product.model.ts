import { DocModel } from './file-manager.model';
import { v4 as uuidv4 } from 'uuid';

export interface IProduct {
    id?: string;
    name: string;
    type: string;
    status: string;
    category?: string;
    templateId: string;
    isActive: boolean;
    details?: {
        description: string;
        documentation?: DocModel;
        leases?: [];
    };
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}
export class Product {
    id: string;
    name: string;
    type: string;
    status: string;
    category?: string;
    templateId: string;
    isActive: boolean;
    details?: {
        description: string;
        documentation?: DocModel;
        leases?: [];
    };
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;

    constructor(model: IProduct) {
        this.id = model.id ?? uuidv4();
        this.name = model.name;
        this.type = model.type;
        this.status = model.status;
        this.category = model.category;
        this.templateId = model.templateId;
        this.isActive = model.isActive ?? true;
        this.details = model.details;
        this.createdAt = model.createdAt;
        this.createdBy = model.createdBy;
        this.updatedAt = model.updatedAt;
        this.updatedBy = model.updatedBy;
        this.deletedAt = model.deletedAt;
        this.deletedBy = model.deletedBy;
    }
}

export const PRODUCT_MODEL_TYPE = 'Product';
