import { DocModel } from './file-manager.model';
import { v4 as uuidv4 } from 'uuid';

export interface ISite {
    id?: string;
    name: string;
    type: string;
    status: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    templateId: string;
    isActive: boolean;
    details?: {
        description: string;
        category: string;
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
export class Site {
    id: string;
    name: string;
    type: string;
    status: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    position?: { lat: number; lng: number };
    templateId: string;
    isActive: boolean;
    details?: {
        description: string;
        category: string;
        documentation?: DocModel;
        leases?: [];
    };
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;

    constructor(model: ISite) {
        this.id = model.id ?? uuidv4();
        this.name = model.name;
        this.type = model.type;
        this.status = model.status;
        this.category = model.category;
        this.latitude = model.latitude;
        this.longitude = model.longitude;
        this.templateId = model.templateId;
        this.position =
            model.latitude && model.longitude
                ? { lat: model.latitude, lng: model.longitude }
                : null;
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

export const SITE_MODEL_TYPE = 'Site';
