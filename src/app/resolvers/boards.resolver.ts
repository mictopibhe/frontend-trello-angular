import { ResolveFn } from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {IBoard} from '../core/interfaces/board.interface';
import {inject} from '@angular/core';
import {BoardService} from '../services/board.service';

export const boardsResolver: ResolveFn<Observable<IBoard[]>> = () => {
  const boardService = inject(BoardService);
  return boardService.fetchBoards().pipe(
    catchError((error) => {
      console.error('Помилка в резольвері:', error);
      return of([]);
    })
  );
};
