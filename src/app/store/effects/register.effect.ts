import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {RegisterActions} from '../actions/register.actions';
import {catchError, map, of, switchMap} from 'rxjs';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class RegisterEffect {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterActions.register),
      switchMap(({request}) =>
        this.authService.register(request).pipe(
          map(response =>
            RegisterActions.registerSuccess({data: response})
          ),
          catchError((error) =>
            of(RegisterActions.registerFailure({error: error.error}))
          )
        )
      )
    )
  );
}
