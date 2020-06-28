export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}

export interface FormBoxes {
    [key: string]: FormBox;
}

export interface FormBox {
    field: string;
    fieldType: string;
    label?: string;
    name?: string;
    type?: string;
    multiple?: boolean;
    placeholder?: string;
    customClass?: string;
    hash?: string;
    value?: number;
    bindId?: boolean;
    select?: {};
    helper?: string;
    searchable?: boolean;
    tooltip?: boolean;
    tooltipInfo?: string;
    disabled?: boolean;
    readonly?: boolean;
    insideLabel?: string;
    isDecimalInput?: boolean;
    numberOfDecimalPlaces?: number;
    mask?: any;
    extraButtons?: any;
    maxlength?: number;
    showIcon?: boolean;
    isInteger?: boolean;
    max?: number;
    prefix?: string;
    noItemsText?: string;
    disableControls?: boolean;
    caveat?: boolean;
}