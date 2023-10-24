import { DocModel } from './file-manager.model';
import { v4 as uuidv4 } from 'uuid';

export interface ILeaseAgreement {
    id?: string;
    type: string;
    status: string;
    propertyId: string;
    property?: {
        id: string;
        name: string;
    };
    propertyType: PropertyType;
    tenantId: string;
    tenant?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    landlordId: string;
    landlord?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    startDate: Date;
    endDate: Date;
    paymentFrequency?: PaymentFrequency;
    rent?: number;
    securityDeposit?: number;
    leaseTerm?: string;
    moveInCondition?: string;
    moveOutCondition?: string;
    templateId?: string;
    template?: {
        id: string;
        name: string;
    };
    isActive: boolean;
    details?: {
        description: string;
        category: string;
        documentation?: DocModel;
    };
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}
export class LeaseAgreement {
    id: string;
    type: string;
    status: string;
    propertyId: string;
    property?: {
        id: string;
        name: string;
    };
    propertyType: PropertyType;
    tenantId: string;
    tenant?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    landlordId: string;
    landlord?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    startDate: Date;
    endDate: Date;
    paymentFrequency?: PaymentFrequency;
    rent?: number;
    securityDeposit?: number;
    leaseTerm?: string;
    moveInCondition?: string;
    moveOutCondition?: string;
    templateId?: string;
    template?: {
        id: string;
        name: string;
    };
    isActive: boolean;
    details?: {
        description: string;
        category: string;
        documentation?: DocModel;
    };
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;

    constructor(model: ILeaseAgreement) {
        this.id = model.id ?? uuidv4();
        this.type = model.type;
        this.status = model.status;
        this.propertyId = model.propertyId;
        this.property = model.property;
        this.propertyType = model.propertyType;
        this.tenantId = model.tenantId;
        this.tenant = model.tenant;
        this.landlordId = model.landlordId;
        this.landlord = model.landlord;
        this.startDate = model.startDate;
        this.endDate = model.endDate;
        this.paymentFrequency = model.paymentFrequency;
        this.rent = model.rent;
        this.securityDeposit = model.securityDeposit;
        this.leaseTerm = model.leaseTerm;
        this.moveInCondition = model.moveInCondition;
        this.moveOutCondition = model.moveOutCondition;
        this.templateId = model.templateId;
        this.template = model.template;
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

export const LEASE_AGREEMENT_MODEL_TYPE = 'LeaseAgreement';

export enum LeaseAgreementStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    EXPIRED = 'Expired',
    TERMINATED = 'Terminated',
    CANCELLED = 'Cancelled',
    RENEWED = 'Renewed',
    SUSPENDED = 'Suspended',
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    DRAFT = 'Draft',
    REVIEW = 'Review',
    PENDING_APPROVAL = 'Pending Approval',
    PENDING_REVIEW = 'Pending Review',
    PENDING_RENEWAL = 'Pending Renewal',
    PENDING_TERMINATION = 'Pending Termination',
    PENDING_CANCELLATION = 'Pending Cancellation',
    PENDING_SUSPENSION = 'Pending Suspension',
}

export enum LeaseAgreementType {
    LEASE = 'Lease',
    SUBLEASE = 'Sublease',
    LICENSE = 'License',
    SUBSCRIPTION = 'Subscription',
    RENTAL = 'Rental',
    OTHER = 'Other',
}

export enum PropertyType {
    SITE = 'SITE',
    PRODUCT = 'PRODUCT',
    OTHER = 'OTHER',
}

export enum PaymentFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    BI_WEEKLY = 'BI-WEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    ANNUALLY = 'ANNUALLY',
    BI_ANNUALLY = 'BI-ANNUALLY',
    OTHER = 'OTHER',
}

export const PaymentFrequencyMap = new Map([
    [PaymentFrequency.DAILY, 'Daily'],
    [PaymentFrequency.WEEKLY, 'Weekly'],
    [PaymentFrequency['BI-WEEKLY'], 'Bi-Weekly'],
    [PaymentFrequency.MONTHLY, 'Monthly'],
    [PaymentFrequency.QUARTERLY, 'Quarterly'],
    [PaymentFrequency.ANNUALLY, 'Annually'],
    [PaymentFrequency['BI-ANNUALLY'], 'Bi-Annually'],
    [PaymentFrequency.OTHER, 'Other'],
]);
