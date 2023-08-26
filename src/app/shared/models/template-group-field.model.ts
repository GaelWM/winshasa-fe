import { v4 as uuidv4 } from 'uuid';
export interface ITemplateGroupField {
    id?: string;
    name: string;
    label?: string;
    value: string | number | Date;
    placeholder?: string;
    type: FieldType;
    options?: string;
    sliderOptions?: SliderFieldOpts;
    required: boolean;
    validators?: FieldValidator;
    hasValidators?: boolean;
    hintMessage?: string;
    labelPosition?: 'before' | 'after';
}

export class TemplateGroupField implements ITemplateGroupField {
    id: string;
    name: string;
    label?: string;
    value: string | number | Date;
    placeholder?: string;
    type: FieldType;
    options?: string;
    sliderOptions?: SliderFieldOpts;
    required: boolean;
    validators?: FieldValidator;
    hasValidators?: boolean;
    hintMessage?: string;
    labelPosition?: 'before' | 'after';

    /**
     * Constructor
     */
    constructor(templateGroupField: ITemplateGroupField) {
        this.id = templateGroupField.id ?? uuidv4();
        this.name = templateGroupField.name;
        this.label = templateGroupField.label;
        this.value = templateGroupField.value;
        this.placeholder = templateGroupField.placeholder;
        this.type = templateGroupField.type;
        this.options = templateGroupField.options;
        this.sliderOptions = templateGroupField.sliderOptions;
        this.required = templateGroupField.required;
        this.validators = templateGroupField.validators;
        this.hasValidators = templateGroupField.hasValidators;
        this.hintMessage = templateGroupField.hintMessage;
        this.labelPosition = templateGroupField.labelPosition;
    }

    toJson(): { [key: string]: any } {
        return JSON.parse(JSON.stringify(this));
    }

    public static isTextField(type: FieldType): boolean {
        return [
            FieldType.Text,
            FieldType.Password,
            FieldType.Number,
            FieldType.Search,
            FieldType.Tel,
            FieldType.Url,
        ].includes(type);
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
    MultiSelect = 'multiselect',
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

export interface FieldValidator {
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

export interface SliderFieldOpts {
    min?: string;
    max?: string;
    step?: string;
    icon?: string;
    disabled?: boolean;
    showTicks?: boolean;
    thumbLabel?: boolean;
    value?: number;
}
