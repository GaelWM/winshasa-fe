export class Metadata {
    id: string;
    type: string;
    value: string;
    entity: string;
    details: {
        description?: string;
        color?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: any) {
        this.id = model.id;
        this.type = model.type;
        this.value = model.value;
        this.entity = model.entity;
        this.details = model.details;
        this.createdAt = model.created_at;
        this.updatedAt = model.updated_at;
    }
}

export enum MetadataEntityType {
    SITE = 'sites',
    PRODUCT = 'products',
    LEASE = 'lease_agreements',
    PAYMENT = 'payments',
    DOCUMENT = 'documents',
    PROJECT = 'projects',
    USER = 'users',
    TASK = 'tasks',
}
