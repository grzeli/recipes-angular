import { AuthState } from 'src/app/statics/interfaces.component';
import * as AuthAction from './auth.actions';
import { User } from '../user.model';

const initialState: AuthState = {
    user: null,
    authError: null,
    loading: false,
};

export function authReducer(state = initialState, action: AuthAction.AuthActions) {
    switch (action.type) {
        case AuthAction.AUTHENTICATE_SUCCESS:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate,
                );
            return {
                ...state,
                authError: null,
                loading: false,
                user,
            };
        case AuthAction.LOGOUT:
            return {
                ...state,
                user: null,
            };
        case AuthAction.LOGIN_START:
        case AuthAction.SIGN_UP_START:
            return {
                ...state,
                authError: null,
                loading: true,
            };
        case AuthAction.AUTHENTICATE_FAIL:
            return {
                ...state,
                authError: action.payload,
                loading: false,
                user: null,
            };
        case AuthAction.CLEAR_ERROR:
            return {
                ...state,
                authError: null,
            };
        default:
            return state;
    }
}
