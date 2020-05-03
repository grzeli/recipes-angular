import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/statics/interfaces.component';
// import { RecipeService } from '../recipe.service';
// import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];

  isAuthenticated = false;

  subscription = new Subscription();

  constructor(
              // private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              // private authService: AuthService,
              private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.subscription.add(this.store.select('auth')
      .pipe(
        map(authState => authState.user)
      )
      .subscribe(user => {
        this.isAuthenticated = !!user;
      })
    );
    this.subscription.add(this.store.select('recipes')
      .pipe(
        map(recipesState => recipesState.recipes)
      )
      .subscribe((recipes: Recipe[]) => this.recipes = recipes)
    );
    // this.subscription = this.recipeService.recipesChanged
    //   .subscribe(
    //     (recipes: Recipe[]) => {
    //       this.recipes = recipes;
    //     }
    //   );
    // this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
