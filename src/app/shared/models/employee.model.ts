export class Employee {
    id?: string;
    userId: string;
    winId: string;
    firstName: string;
    email: string;
    middleName?: string;
    lastName: string;
    gender: string;
    jobTitle?: string;
    mobileNumber?: string;
    profilePic?: string;
    address: string;
    details?: {
        company?: string;
        country?: string;
        city?: string;
        language?: string;
    };

    constructor(model: any) {
        this.id = model.id;
        this.userId = model.user_id;
        this.winId = model.win_id;
        this.firstName = model.first_name;
        this.email = model.email;
        this.middleName = model.middle_name;
        this.lastName = model.last_name;
        this.gender = model.gender;
        this.mobileNumber = model.mobile_number;
        this.profilePic = model.profile_pic;
        this.jobTitle = model.job_title;
        this.address = model.address;
        this.details = model.details;
    }
}
