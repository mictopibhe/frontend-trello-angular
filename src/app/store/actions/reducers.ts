import {IAuthState} from '../types/authState.interface';
import {Action, createReducer, on} from '@ngrx/store';
import {RegisterActions} from './register.actions';

const initialState: IAuthState = {
  isSubmitting: false
};

const authReducer = createReducer(
  initialState,
  on(RegisterActions.register,
    (state) => ({
      ...state,
      isSubmitting: true
    })
  )
);

export function reducer(state: IAuthState = initialState, action: Action) {
  console.log("reducer");
  return authReducer(state, action);
}
