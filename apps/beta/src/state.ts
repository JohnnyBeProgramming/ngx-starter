import { ActivatedRoute } from '@angular/router';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

export interface BetaStateModel {
  counter: number;
}

export class InitState {
  public static readonly type = '[alpha] Init State';
  constructor(public initialState: Partial<BetaStateModel>) {}
}

@State<BetaStateModel>({
  name: 'beta'
})
export class BetaState implements NgxsOnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  @Selector()
  static getCounter(state: BetaStateModel) {
    return state.counter;
  }

  ngxsOnInit({ dispatch }: StateContext<BetaStateModel>) {
    this.getInitialState()
      .pipe(first())
      .subscribe({
        next: initialState => dispatch(new InitState(initialState))
      });
  }

  // Reducers
  @Action(InitState)
  init({ patchState }: StateContext<BetaStateModel>, { initialState }) {
    patchState(initialState);
  }

  private getInitialState(): Observable<Partial<BetaStateModel>> {
    return of({
      counter: 0
    });
  }
}
