import { v4 as uuidv4 } from 'uuid';
import { LeaseAgreement } from './lease-agreement.model';

export interface IPayment {
    id?: string;
    ownerId: string;
    ownerType: PaymentOwnerType;
    paymentMethod: PaymentMethod;
    amount: number;
    currency: Currency;
    paymentDate: string;
    dueDate: string;
    status: PaymentStatus;
    paymentReference?: string;
    paymentSlip?: string;
    generatedBy: string;
    notes?: string;
    owner: LeaseAgreement;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}
export class Payment {
    id: string;
    ownerId: string;
    ownerType: PaymentOwnerType;
    paymentMethod: PaymentMethod;
    amount: number;
    currency: Currency;
    paymentDate: string;
    dueDate: string;
    status: PaymentStatus;
    paymentReference?: string;
    paymentSlip?: string;
    generatedBy?: string;
    notes?: string;
    owner: LeaseAgreement;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;

    constructor(model: IPayment) {
        this.id = model.id ?? uuidv4();
        this.ownerId = model.ownerId;
        this.ownerType = model.ownerType;
        this.paymentMethod = model.paymentMethod;
        this.amount = model.amount;
        this.currency = model.currency;
        this.paymentDate = model.paymentDate;
        this.dueDate = model.dueDate;
        this.status = model.status;
        this.paymentReference = model.paymentReference;
        this.paymentSlip = model.paymentSlip;
        this.generatedBy = model.generatedBy;
        this.notes = model.notes;
        this.owner = model.owner;
        this.createdAt = model.createdAt;
        this.createdBy = model.createdBy;
        this.updatedAt = model.updatedAt;
        this.updatedBy = model.updatedBy;
        this.deletedAt = model.deletedAt;
        this.deletedBy = model.deletedBy;
    }
}

export const PAYMENT_MODEL_TYPE = 'Payment';

export enum PaymentMethod {
    CASH = 'CASH',
    CHECK = 'CHECK',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    MOBILE_MONEY = 'MOBILE_MONEY',
    OTHER = 'OTHER',
}

export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    KES = 'KES',
    CDF = 'CDF',
    ZAR = 'ZAR',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    OVERDUE = 'OVERDUE',
}

export const PAYMENT_METHODS = [
    'CASH',
    'CHECK',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'MOBILE_MONEY',
    'OTHER',
];

export const CURRENCIES = Object.values(Currency);

export const PAYMENT_STATUSES = Object.values(PaymentStatus);

export const PAYMENT_FREQUENCIES = [
    'DAILY',
    'WEEKLY',
    'BI-WEEKLY',
    'MONTHLY',
    'QUARTERLY',
    'BI-ANNUALLY',
    'ANNUALLY',
    'OTHER',
];

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

export enum PaymentOwnerType {
    LEASE = 'lease_agreements',
    PROJECT = 'projects',
    OTHER = 'other',
}
