import {createActionGroup, props} from '@ngrx/store';
import {IAuthRequest} from '../types/AuthRequest.interface';

export const RegisterActions = createActionGroup({
  source: 'Auth',
  events: {
    'Register': props<IAuthRequest>(),
    'Register Success': props<{ data: unknown }>(),
    'Register Failure': props<{ error: unknown }>(),
  }
});
