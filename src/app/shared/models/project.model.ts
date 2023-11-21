import { DocModel } from './file-manager.model';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { PaymentFrequency, PaymentMethod } from './payment.model';

export interface IProject {
    id?: string;
    name: string;
    type: ProjectType;
    status: ProjectStatus;
    description?: string;
    startDate: string;
    endDate?: string;
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
    startDate: string;
    endDate?: string;
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

export interface IProjectUser {
    projectUserId?: string;
    userId: string;
    projectId: string;
    roleId: string;
    salary: number;
    firstName: string;
    lastName: string;
    roleName: string;
    projectName: string;
    email?: string;
    phone?: string;
    paymentMethod?: PaymentMethod;
    paymentFrequency?: PaymentFrequency;
}

export class ProjectUser {
    id?: string;
    user: {
        id: string;
        fullName: string;
        email?: string;
        phone?: string;
    };
    project: {
        id: string;
        name: string;
    };
    role: {
        id: string;
        name: string;
    };
    payment?: {
        method: PaymentMethod;
        frequency: PaymentFrequency;
    };
    salary: number;
    constructor(model: IProjectUser) {
        this.id = model.projectUserId;
        this.user = {
            id: model.userId,
            fullName: `${model.firstName} ${model.lastName}`,
            email: model.email,
            phone: model.phone,
        };
        this.project = {
            id: model.projectId,
            name: model.projectName,
        };
        this.role = {
            id: model.roleId,
            name: model.roleName,
        };
        this.payment = {
            method: model.paymentMethod,
            frequency: model.paymentFrequency,
        };
        this.salary = model.salary;
    }
}

export const ProjectTypes = Object.values(ProjectType);
