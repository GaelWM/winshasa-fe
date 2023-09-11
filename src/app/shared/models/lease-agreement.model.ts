import { DocModel } from './file-manager.model';
import { v4 as uuidv4 } from 'uuid';

export interface ILeaseAgreement {
    id?: string;
    type: string;
    status: string;
    propertyId: string;
    propertyType: PropertyType;
    tenantId: string;
    landlordId: string;
    startDate: Date;
    endDate: Date;
    dailyRent?: number;
    monthlyRent?: number;
    weeklyRent?: number;
    annualRent?: number;
    securityDeposit?: number;
    paymentFrequency?: PaymentFrequency;
    leaseTerm?: string;
    moveInCondition?: string;
    moveOutCondition?: string;
    templateId?: string;
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
    propertyType: PropertyType;
    tenantId: string;
    landlordId: string;
    startDate: Date;
    endDate: Date;
    dailyRent?: number;
    monthlyRent?: number;
    weeklyRent?: number;
    annualRent?: number;
    securityDeposit?: number;
    paymentFrequency?: PaymentFrequency;
    leaseTerm?: string;
    moveInCondition?: string;
    moveOutCondition?: string;
    templateId?: string;
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
        this.propertyType = model.propertyType;
        this.tenantId = model.tenantId;
        this.landlordId = model.landlordId;
        this.startDate = model.startDate;
        this.endDate = model.endDate;
        this.dailyRent = model.dailyRent;
        this.monthlyRent = model.monthlyRent;
        this.weeklyRent = model.weeklyRent;
        this.annualRent = model.annualRent;
        this.securityDeposit = model.securityDeposit;
        this.paymentFrequency = model.paymentFrequency;
        this.leaseTerm = model.leaseTerm;
        this.moveInCondition = model.moveInCondition;
        this.moveOutCondition = model.moveOutCondition;
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
    SITE = 'Site',
    PRODUCT = 'PRODUCT',
    FLOOR = 'Floor',
    ROOM = 'Room',
    BUILDING = 'Building',
    OTHER = 'Other',
}

export enum PaymentFrequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    ANNUALLY = 'annually',
}
