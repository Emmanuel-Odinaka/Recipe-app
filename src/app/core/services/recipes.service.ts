import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { Recipe } from '../model/recipe.model';
import { catchError, delayWhen, retryWhen, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

const BASE_PATH = environment.basePath;
const REFRESH_INTERVAL = 50000;
const timer$ = timer(0, REFRESH_INTERVAL);

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private http: HttpClient) {}


  // Normal method without caching
  // recipes$ = this.http
  //   .get<Recipe[]>(`${BASE_PATH}/recipes`)
  //   .pipe(catchError((error) => of([])));

  // with the caching method
  recipes$ = this.getRecipesList()

  getRecipesList(): Observable<Recipe[]> {
    if (!this.recipes$) {
      return timer$.pipe(
      switchMap(_ => this.http.get<Recipe[]>(`${BASE_PATH}/recipes`)),
      /**Popular way using shareReplay**/
      shareReplay(1)
      /**Recommended way using RxJS7+
      share({
        connector : () => new ReplaySubject(),
        resetOnRefCountZero : true,
        restOnComplete: true,
        resetOnError: true
      }) */
    );
    }
    return this.recipes$;
  } 



  // create an action stream for recipes
  private filterRecipeSubject = new BehaviorSubject<Recipe>({ title: '' });

  // extract the readonly stream
  filteredRecipeAction$ = this.filterRecipeSubject.asObservable();

  // to update the filter
  updateFilter(criteria: Recipe) {
    this.filterRecipeSubject.next(criteria);
  }

  saveRecipe(formValue: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${BASE_PATH}/recipes/save`, formValue);
  }
}
