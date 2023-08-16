import { TemplateGroupField } from './template-group-field.model';
export interface ITemplateGroup {
    id: string;
    name: string;
    template?: { id?: number; name?: string };
    parentId?: string;
    order?: number;
    details?: string;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    fields?: TemplateGroupField[];
}

export class TemplateGroup implements ITemplateGroup {
    id: string;
    name: string;
    template?: { id?: number; name?: string };
    parentId: string;
    order: number;
    details?: string;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    fields?: TemplateGroupField[];

    constructor(templateGroup: ITemplateGroup) {
        this.id = templateGroup.id;
        this.template = templateGroup.template;
        this.parentId = templateGroup.parentId;
        this.name = templateGroup.name;
        this.order = templateGroup.order;
        this.createdAt = templateGroup.createdAt;
        this.createdBy = templateGroup.createdBy;
        this.updatedAt = templateGroup.updatedAt;
        this.updatedBy = templateGroup.updatedBy;

        if (templateGroup.fields) {
            this.fields = templateGroup.fields.map((templateGroupField) => {
                if (!(templateGroupField instanceof TemplateGroupField)) {
                    return new TemplateGroupField(templateGroupField);
                }

                return templateGroupField;
            });
        }
    }

    toJson(): { [key: string]: any } {
        return {
            id: this.id,
            template: this.template,
            parentId: this.parentId,
            name: this.name,
            order: this.order,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy,
            fields: this.fields?.map((templateGroupField) =>
                templateGroupField.toJson()
            ),
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
