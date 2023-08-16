export interface ITemplateGroupField {
    id: string;
    group?: { id?: number; name?: string };
    parentId?: string;
    templateId?: string;
    order?: number;
    name: string;
    details?: JsonFormControls;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export class TemplateGroupField implements ITemplateGroupField {
    id: string;
    group?: { id?: number; name?: string };
    templateId?: string;
    parentId: string;
    order: number;
    name: string;
    details?: JsonFormControls;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;

    /**
     * Constructor
     */
    constructor(templateGroupField: ITemplateGroupField) {
        this.id = templateGroupField.id;
        this.group = templateGroupField.group;
        this.parentId = templateGroupField.parentId;
        this.order = templateGroupField.order;
        this.name = templateGroupField.name;
        this.details = templateGroupField.details;
        this.createdAt = templateGroupField.createdAt;
        this.createdBy = templateGroupField.createdBy;
        this.updatedAt = templateGroupField.updatedAt;
        this.updatedBy = templateGroupField.updatedBy;
    }

    toJson(): { [key: string]: any } {
        return {
            id: this.id,
            group: this.group,
            parentId: this.parentId,
            order: this.order,
            name: this.name,
            details: this.details,
            created_at: this.createdAt,
            created_by: this.createdBy,
            updated_at: this.updatedAt,
            updated_by: this.updatedBy,
        };
    }
}

export enum FieldType {
    Text = 'text',
    Password = 'password',
    Url = 'url',
    Search = 'search',
    Tel = 'tel',
    Textarea = 'textarea',
    'Number' = 'number',
    Date = 'date',
    DateRange = 'date-range',
    DateTime = 'dateTime',
    Time = 'time',
    Select = 'select',
    MultiSelect = 'multi-select',
    Slider = 'slider',
    Radio = 'radio',
    Checkbox = 'checkbox',
    AutoComplete = 'autocomplete',
    MultiAutoComplete = 'multi-autocomplete',
}

export const fieldOptions = [
    { name: 'Text', value: FieldType.Text },
    { name: 'Password', value: FieldType.Password },
    { name: 'Url', value: FieldType.Url },
    { name: 'Search', value: FieldType.Search },
    { name: 'Tel', value: FieldType.Tel },
    { name: 'Textarea', value: FieldType.Textarea },
    { name: 'Number', value: FieldType.Number },
    { name: 'Date', value: FieldType.Date },
    { name: 'Date Time', value: FieldType.DateTime },
    { name: 'Date Range', value: FieldType.DateRange },
    { name: 'Time', value: FieldType.Time },
    { name: 'Select', value: FieldType.Select },
    { name: 'Multi Select', value: FieldType.MultiSelect },
    { name: 'Slider', value: FieldType.Slider },
    { name: 'Radio', value: FieldType.Radio },
    { name: 'Checkbox', value: FieldType.Checkbox },
    { name: 'Auto Complete', value: FieldType.AutoComplete },
    // { name: 'Multi Auto Complete', value: FieldType.MultiAutoComplete },
];

export interface JsonFormValidators {
    min?: number;
    max?: number;
    required?: boolean;
    requiredTrue?: boolean;
    email?: boolean;
    minLength?: boolean;
    maxLength?: boolean;
    pattern?: string;
    nullValidator?: boolean;
}
export interface JsonFormControlOptions {
    min?: string;
    max?: string;
    step?: string;
    icon?: string;
    disabled?: boolean;
    showTicks?: boolean;
    thumbLabel?: boolean;
    value?: number;
}
export interface JsonFormControls {
    name: string;
    label?: string;
    value: string | number | Date;
    placeholder?: string;
    type: FieldType;
    options?: string;
    sliderOptions?: JsonFormControlOptions;
    required: boolean;
    validators?: JsonFormValidators;
    hasValidators?: boolean;
    hintMessage?: string;
    labelPosition?: 'before' | 'after';
}

export interface JsonFormData {
    controls: JsonFormControls[];
}

export type ValidationPattern = { name: string; value: string };

export const REGEX_PATTERNS: ValidationPattern[] = [
    {
        name: 'Detects incorrect email',
        value: '([a-zA-Z0-9\\_\\-\\.]+)@([a-zA-Z]+).(.+)',
    },
    {
        name: 'Address (only comma allowed as special character)',
        value: '(\\d*)\\s?(.+),\\s(.+)\\s([A-Z]{2,3})\\s(\\d{4})',
    },
    {
        name: 'Only capital letters allowed & numbers',
        value: '^[A-Z0-9]*',
    },
];
