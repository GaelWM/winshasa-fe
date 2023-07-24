export class Status {
    id: number;
    name: string;
    slug: string;
    entityType: string;
    description?: string;
    color?: string;
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
        this.entityType = model.entity_type;
        this.description = model.description;
        this.color = model.color;
        this.createdAt = model.created_at;
        this.createdBy = model.created_by;
        this.updatedAt = model.updated_at;
        this.updatedBy = model.updated_by;
        this.deletedAt = model.deleted_at;
        this.deletedBy = model.deleted_by;
    }
}
