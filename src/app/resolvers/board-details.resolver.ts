import {ResolveFn, Router} from '@angular/router';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {BoardDetails} from '../core/interfaces/boardDetails.interface';
import {inject} from '@angular/core';
import {BoardService} from '../services/board.service';

export const boardDetailsResolver: ResolveFn<Observable<BoardDetails>> = (route, state) => {
  const boardId = route.params['id'];
  const service = inject(BoardService);
  const router = inject(Router);

  return service.fetchBoard(boardId).pipe(
    catchError((error) => {
      console.error('Помилка в резольвері:', error);
      router.navigate(['/']);
      return EMPTY;
    })
  );
};
