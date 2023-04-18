import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Recipe } from '../core/model/recipe.model';
import { RecipesService } from '../core/services/recipes.service';
import { SharedDataService } from '../core/services/shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesListComponent implements OnInit {
  constructor(private service: RecipesService, 
    private sharedService: SharedDataService, 
    private router: Router 
    ) {}

  recipes$ = this.service.recipes$;
  filteredRecipes$ = combineLatest([
    this.recipes$,
    this.service.filteredRecipeAction$,
  ]).pipe(
    map(([recipes, filter]: [Recipe[], Recipe]) => {
      return recipes.filter(
        (recipe) =>
          recipe.title
            ?.toLowerCase()
            .indexOf(filter.title?.toLowerCase() ?? '') !== -1
      );
    })
  );

  editRecipe(recipe: Recipe) {
    this.sharedService.updateSelectedRecipe(recipe);
    this.router.navigate(['/recipes/details'])
  }

  ngOnInit(): void {}
}
