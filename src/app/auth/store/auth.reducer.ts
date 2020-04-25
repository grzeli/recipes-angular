import { AuthState } from 'src/app/statics/interfaces.component';

const initialState: AuthState = {
    user: null
};

export function authReducer(state = initialState, action) {
    return state;
}
