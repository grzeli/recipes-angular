import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../shared/data-storage.service';
import { AppState } from '../statics/interfaces.component';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  constructor(
    private dataStorageService: DataStorageService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

}
