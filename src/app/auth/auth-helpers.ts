export enum ErrorMessage {
    EmailExists = 'EMAIL_EXISTS',
    OperationNotAllowed = 'OPERATION_NOT_ALLOWED',
    TooManyAttempts = 'TOO_MANY_ATTEMPTS_TRY_LATER',
    EmailNotFound = 'EMAIL_NOT_FOUND',
    InvalidPassword = 'INVALID_PASSWORD',
    UserDisabled = 'USER_DISABLED',
}

export interface UserData {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
}
