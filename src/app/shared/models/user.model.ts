export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
    avatar?: string;
    image?: string;
    isActive: boolean;
    roles?: string[];
    permissions?: { name: string; type: string }[];
    details?: {
        settings?: {
            layout?: string;
            scheme?: string;
            theme?: string;
        };
    };
    emailVerifiedAt?: string;
    lastConnected?: string;
    status?: UserStatus;
    createdAt?: string;
    updatedAt?: string;
}

export enum UserStatus {
    Online = 'online',
    Away = 'away',
    Busy = 'busy',
    NotVisible = 'not-visible',
}

export class User {
    id?: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    address: string;
    phone: string;
    avatar: string;
    isActive: boolean;
    roles?: string[];
    permissions?: { name: string; type: string }[];
    details?: {
        settings?: {
            layout?: string;
            scheme?: string;
            theme?: string;
        };
    };

    emailVerifiedAt: string;
    lastConnected: string;
    status: 'online' | 'away' | 'busy' | 'not-visible';
    createdAt?: string;
    updatedAt?: string;

    constructor(model: any) {
        this.id = model.id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = `${model.firstName} ${model.lastName}`;
        this.email = model.email;
        this.address = model.address;
        this.phone = model.phone;
        this.avatar = model.image;
        this.roles = model.roles;
        this.permissions = model.permissions;
        this.details = model.details;
        this.emailVerifiedAt = model.emailVerifiedAt;
        this.lastConnected = model.lastConnected;
        this.status = model.onlineStatus;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}
