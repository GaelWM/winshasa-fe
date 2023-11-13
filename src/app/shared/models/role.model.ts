import { v4 as uuidv4 } from 'uuid';

export interface IRole {
    id?: string;
    name: string;
    permissions?: { id: string; name: string }[];
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Role {
    id: string;
    name: string;
    permissions?: { id: string; name: string }[];
    description: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IRole) {
        this.id = model.id ?? uuidv4();
        this.name = model.name;
        this.permissions = model.permissions;
        this.description = model.description;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}

export const ROLE_MODEL_TYPE = 'Role';
