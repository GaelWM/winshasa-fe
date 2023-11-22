import { DocModel } from './file-manager.model';
import { v4 as uuidv4 } from 'uuid';
import { Currency } from './payment.model';

export interface IInvoice {
    id?: string;
    ownerId: string;
    ownerType: InvoiceOwnerType;

    invoiceNumber: string;
    invoiceDate: string;
    invoiceStatus: InvoiceStatus;

    dueDate: string;
    customerId: string;
    customerName: string;
    customerEmail?: string;
    billingAddress?: string;
    billingContact?: string;
    shippingAddress?: string;

    totalAmount: number;
    taxAmount?: number;
    discountAmount?: number;
    grandTotal: number;
    currency: Currency;
    notes: string;
    generateBy: string;
    details?: {
        items: {
            item: string;
            description?: string;
            quantity: number;
            unitPrice: number;
            currency: Currency;
            lineTotal: number;
        }[];
    };
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    deletedAt?: string;
    deletedBy?: string;
}
export class Invoice {
    id: string;
    ownerId: string;
    ownerType: InvoiceOwnerType;

    invoiceNumber: string;
    invoiceDate: string;
    invoiceStatus: InvoiceStatus;

    dueDate: string;
    customerId: string;
    customerName: string;
    customerEmail?: string;
    billingAddress?: string;
    billingContact?: string;
    shippingAddress?: string;

    totalAmount: number;
    taxAmount?: number;
    discountAmount?: number;
    grandTotal: number;
    currency: Currency;
    notes: string;
    generateBy: string;
    details?: {
        items: {
            item: string;
            description?: string;
            quantity: number;
            unitPrice: number;
            currency: Currency;
            lineTotal: number;
        }[];
    };
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    deletedAt?: string;
    deletedBy?: string;

    constructor(model: IInvoice) {
        this.id = model.id ?? uuidv4();
        this.ownerId = model.ownerId;
        this.ownerType = model.ownerType;

        this.invoiceNumber = model.invoiceNumber;
        this.invoiceDate = model.invoiceDate;
        this.invoiceStatus = model.invoiceStatus;
        this.dueDate = model.dueDate;

        this.customerId = model.customerId;
        this.customerName = model.customerName;
        this.customerEmail = model.customerEmail;
        this.billingAddress = model.billingAddress;
        this.billingContact = model.billingContact;
        this.shippingAddress = model.shippingAddress;

        this.totalAmount = model.totalAmount;
        this.taxAmount = model.taxAmount;
        this.discountAmount = model.discountAmount;
        this.grandTotal = model.grandTotal;
        this.currency = model.currency;
        this.notes = model.notes;
        this.generateBy = model.generateBy;

        this.details = model.details;
        this.createdAt = model.createdAt;
        this.createdBy = model.createdBy;
        this.updatedAt = model.updatedAt;
        this.updatedBy = model.updatedBy;
        this.deletedAt = model.deletedAt;
        this.deletedBy = model.deletedBy;
    }
}

export const INVOICE_MODEL_TYPE = 'Invoice';

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
}
export const INVOICE_STATUSES = Object.values(InvoiceStatus);

export enum InvoiceOwnerType {
    LEASE = 'lease_agreements',
    PRODUCT = 'products',
    PROJECT_USER = 'project_user_roles',
    USER = 'users',
}
export const INVOICE_OWNER_TYPES = Object.values(InvoiceOwnerType);
