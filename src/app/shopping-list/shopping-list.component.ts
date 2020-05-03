import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import { AppState } from '../statics/interfaces.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
