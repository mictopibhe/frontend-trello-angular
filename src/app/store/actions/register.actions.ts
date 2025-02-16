import {createActionGroup, props} from '@ngrx/store';
import {IAuthRequest} from '../../core/interfaces/auth/AuthRequest.interface';

export const RegisterActions = createActionGroup({
  source: 'Auth',
  events: {
    'Register': props<{ request: IAuthRequest }>(),
    'Register Success': props<{ data: unknown }>(),
    'Register Failure': props<{ error: unknown }>(),
  }
});
