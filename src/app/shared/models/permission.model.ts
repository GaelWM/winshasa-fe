import { v4 as uuidv4 } from 'uuid';

export interface IPermission {
    id?: string;
    name: string;
    entityType?: string;
    entityId?: string;
    ownerId?: string;
    ownerType?: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Permission {
    id: string;
    name: string;
    entityType?: string;
    entityId?: string;
    ownerId?: string;
    ownerType?: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IPermission) {
        this.id = model.id ?? uuidv4();
        this.name = model.name;
        this.entityType = model.entityType;
        this.entityId = model.entityId;
        this.ownerId = model.ownerId;
        this.ownerType = model.ownerType;
        this.description = model.description;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}

export const PERMISSION_MODEL_TYPE = 'Permission';
