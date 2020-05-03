import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { AppState } from '../statics/interfaces.component';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
// import { DataStorageService } from '../shared/data-storage.service';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(
        // private dataStorageService: DataStorageService,
        private recipesService: RecipeService,
        private store: Store<AppState>,
        private actions$: Actions,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const recipes = this.recipesService.getRecipes();
        // if (recipes.length === 0) {
            // return this.dataStorageService.fetchRecipes();
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => recipesState.recipes),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipeActions.FetchRecipes());
                    return this.actions$.pipe(
                        ofType(RecipeActions.SET_RECIPES),
                        take(1)
                    );
                } else {
                    return of(recipes);
                }
            })
        );
        // else {
        //     return recipes;
        // }
    }
}
