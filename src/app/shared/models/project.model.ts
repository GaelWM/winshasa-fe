import { DocModel } from './file-manager.model';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';

export interface IProject {
    id?: string;
    name: string;
    type: ProjectType;
    status: ProjectStatus;
    description?: string;
    startDate: Date;
    endDate?: Date;
    cost?: number;
    ownerId?: string;
    owner: {
        id: string;
        fullName: string;
    };
    users?: User[];
    templateId?: string;
    template?: {
        id: string;
        name: string;
    };
    details?: {};
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}
export class Project {
    id: string;
    name: string;
    type: ProjectType;
    status: ProjectStatus;
    description?: string;
    startDate: Date;
    endDate?: Date;
    cost?: number;
    ownerId?: string;
    owner: {
        id: string;
        fullName: string;
    };
    users?: User[];
    templateId?: string;
    template?: {
        id: string;
        name: string;
    };
    details?: {};
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;

    constructor(model: IProject) {
        this.id = model.id ?? uuidv4();
        this.name = model.name;
        this.type = model.type;
        this.status = model.status;
        this.description = model.description;
        this.startDate = model.startDate;
        this.endDate = model.endDate;
        this.cost = model.cost;
        this.ownerId = model.ownerId;
        this.owner = model.owner;
        this.users = model.users;
        this.templateId = model.templateId;
        this.template = model.template;
        this.details = model.details;
        this.createdAt = model.createdAt;
        this.createdBy = model.createdBy;
        this.updatedAt = model.updatedAt;
        this.updatedBy = model.updatedBy;
        this.deletedAt = model.deletedAt;
        this.deletedBy = model.deletedBy;
    }
}

export const PROJECT_MODEL_TYPE = 'Project';

export enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    DELETED = 'DELETED',
    ARCHIVED = 'ARCHIVED',
    COMPLETED = 'COMPLETED',
}

export const ProjectStatuses = Object.values(ProjectStatus);

export enum ProjectType {
    SHORT_TERM = 'SHORT-TERM',
    LONG_TERM = 'LONG-TERM',
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    MAINTENANCE = 'MAINTENANCE',
    RESEARCH = 'RESEARCH',
    DEVELOPMENT = 'DEVELOPMENT',
    ADMINISTRATION = 'ADMINISTRATION',
    TESTING = 'TESTING',
}

export const ProjectTypes = Object.values(ProjectType);
