import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/statics/interfaces.component';
import * as RecipeActions from '../store/recipe.actions';
import { map, switchMap } from 'rxjs/operators';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => +params.id),
        switchMap((id: number) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipeState => recipeState.recipes.find((recipe: Recipe, index: number) => index === this.id))
      )
      .subscribe((recipe: Recipe) => this.recipe = recipe);
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
