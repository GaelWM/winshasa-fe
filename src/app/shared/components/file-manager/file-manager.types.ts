export interface Items {
    folders: Item[];
    files: Item[];
    path: any[];
}

export interface Item {
    id?: string;
    folderId?: string;
    name?: string;
    url?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    size?: string;
    type?: string;
    details: {
        contents?: string | null;
        description?: string | null;
    };
}

export enum DocumentType {
    FOLDER = 'FOLDER',
    PDF = 'application/pdf',
    PNG = 'image/png',
    JPEG = 'image/jpeg',
    JPG = 'image/jpg',
    DOC = 'application/msword',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS = 'application/vnd.ms-excel',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPT = 'application/vnd.ms-powerpoint',
    PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    TXT = 'text/plain',
    CSV = 'text/csv',
    ZIP = 'application/zip',
    RAR = 'application/x-rar-compressed',
    OTHER = 'OTHER',
}

// create map document type value --> key
export const DocumentTypeMap = new Map([
    [DocumentType.FOLDER, 'Folder'],
    [DocumentType.PDF, 'PDF'],
    [DocumentType.PNG, 'PNG'],
    [DocumentType.JPEG, 'JPEG'],
    [DocumentType.JPG, 'JPG'],
    [DocumentType.DOC, 'DOC'],
    [DocumentType.DOCX, 'DOCX'],
    [DocumentType.XLS, 'XLS'],
    [DocumentType.XLSX, 'XLSX'],
    [DocumentType.PPT, 'PPT'],
    [DocumentType.PPTX, 'PPTX'],
    [DocumentType.TXT, 'TXT'],
    [DocumentType.CSV, 'CSV'],
    [DocumentType.ZIP, 'ZIP'],
    [DocumentType.RAR, 'RAR'],
    [DocumentType.OTHER, 'OTHER'],
]);

export enum DocumentOwnerType {
    SITE = 'sites',
    PRODUCT = 'products',
    USER = 'users',
    LEASE = 'lease_agreements',
    PAYMENT = 'payments',
    INVOICE = 'invoices',
    DOCUMENT = 'documents',
    PROJECT = 'projects',
}

export enum DocumentStatus {
    FOLDER_CREATED = 'FOLDER_CREATED',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
    ARCHIVED = 'ARCHIVED',
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
    DRAFT = 'DRAFT',
    LOCKED = 'LOCKED',
}
