import { ActivatedRoute } from '@angular/router';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

export interface AlphaStateModel {
  counter: number;
}

export class InitState {
  public static readonly type = '[alpha] Init State';
  constructor(public initialState: Partial<AlphaStateModel>) {}
}

@State<AlphaStateModel>({
  name: 'alpha'
})
export class AlphaState implements NgxsOnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  @Selector()
  static getCounter(state: AlphaStateModel) {
    return state.counter;
  }

  ngxsOnInit({ dispatch }: StateContext<AlphaStateModel>) {
    this.getInitialState()
      .pipe(first())
      .subscribe({
        next: initialState => dispatch(new InitState(initialState))
      });
  }

  // Reducers
  @Action(InitState)
  init({ patchState }: StateContext<AlphaStateModel>, { initialState }) {
    patchState(initialState);
  }

  private getInitialState(): Observable<Partial<AlphaStateModel>> {
    return of({
      counter: 0
    });
  }
}
