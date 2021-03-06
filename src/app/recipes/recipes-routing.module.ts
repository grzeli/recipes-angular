import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RecipeListComponent } from './recipe-list/recipe-list.component';

const routes: Routes = [
    {
        path: '',
        component: RecipesComponent,
        children: [
            {
            path: '',
            component: RecipeListComponent
            },
            {
            path: 'new',
            component: RecipeEditComponent,
            canActivate: [AuthGuard]
            },
            {
            path: ':id',
            component: RecipeDetailComponent,
            resolve: [RecipesResolverService]
            },
            {
            path: ':id/edit',
            component: RecipeEditComponent,
            resolve: [RecipesResolverService],
            canActivate: [AuthGuard]
            },
        ]
    },
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class RecipesRoutingModule {}
