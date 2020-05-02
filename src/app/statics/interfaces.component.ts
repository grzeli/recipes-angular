import { User } from '../auth/user.model';
import { Ingredient } from '../shared/ingredient.model';

export interface AuthState {
    user: User;
    authError: string;
    loading: boolean;
}

export interface UserData {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
}

export interface ShoppingListState {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

export interface AppState {
    shoppingList: ShoppingListState;
    auth: AuthState;
}
