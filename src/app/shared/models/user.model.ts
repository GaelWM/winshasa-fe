import { Employee } from './employee.model';

export class User {
    //user details
    id?: string;
    name: string;
    email: string;
    settings?: {
        layout?: string;
        scheme?: string;
        theme?: string;
        status?: 'online' | 'away' | 'busy' | 'not-visible';
    };
    avatar: string;
    permissions?: Record<string, unknown>;

    // employee details
    employee?: Employee;

    constructor(model: any) {
        this.id = model.id;
        this.name = model.name;
        this.email = model.email;
        this.settings = model.settings;
        this.permissions = model.permissions;
        this.avatar = model.avatar;
        if (model.employee) {
            this.employee = new Employee(model.employee);
        }
    }
}
