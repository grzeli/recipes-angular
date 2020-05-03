import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as RecipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/statics/interfaces.component';

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipeActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>('https://ng-recipes-book-2ab12.firebaseio.com/recipes.json');
        }),
        map(recipes => {
            return recipes.map(recipe => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          }),
        map(recipes => new RecipeActions.SetRecipes(recipes))
    );

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(
            ofType(RecipeActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipesState]) => this.http.put('https://ng-recipes-book-2ab12.firebaseio.com/recipes.json', recipesState.recipes)
        )
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>,
    ) {}
}
