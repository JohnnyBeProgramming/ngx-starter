import { ActivatedRoute } from '@angular/router';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

export interface HomeStateModel {
  name: string;
}

export class InitState {
  public static readonly type = '[home] Init State';
  constructor(public initialState: Partial<HomeStateModel>) {}
}

export class SetName {
  public static readonly type = '[home] Set Name';
  constructor(public name: string) {}
}

@State<HomeStateModel>({
  name: 'home'
})
export class HomeState implements NgxsOnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  @Selector()
  static getName(state: HomeStateModel) {
    return state.name;
  }

  ngxsOnInit({ dispatch }: StateContext<HomeStateModel>) {
    this.getInitialState()
      .pipe(first())
      .subscribe({
        next: initialState => dispatch(new InitState(initialState))
      });
  }

  // Reducers
  @Action(InitState)
  init({ patchState }: StateContext<HomeStateModel>, { initialState }) {
    patchState(initialState);
  }

  @Action(SetName)
  setName({ patchState }: StateContext<HomeStateModel>, { name }) {
    patchState({
      name
    });
  }

  private getInitialState(): Observable<Partial<HomeStateModel>> {
    return this.activatedRoute.queryParams.pipe(
      switchMap(queryParams => {
        return of({
          name: queryParams['name'] || 'home'
        });
      })
    );
  }

}
