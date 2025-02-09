import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IBoard} from '../core/interfaces/board.interface';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {IBoardDetails} from '../core/interfaces/boardDetails.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);

  baseUrl = `${environment.baseURL}/board`;

  fetchBoards(): Observable<IBoard[]> {
    return this.http.get<{ boards: IBoard[] }>(
      this.baseUrl, {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      map(response => response.boards),
      catchError((error) => {
        console.error('Помилка при завантаженні дошок з серверу:', error);
        return of([]);
      })
    );
  }

  fetchBoard(id: number): Observable<IBoardDetails> {
    return this.http.get<IBoardDetails>(
      `${this.baseUrl}/${id}`, {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      catchError((error) => {
        console.error('Помилка при завантаженні даних дошки:', error);
        return throwError(() => new Error('Не вдалося завантажити дошку'));
      })
    );
  }

  createBoard(title: string): Observable<HttpResponse<object>> {
    const newBoard: { title: string; custom: any } = {
      title: title,
      custom: {description: ''}
    };
    return this.http.post<HttpResponse<object>>(
      this.baseUrl, newBoard, {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      catchError((error) => {
        console.error('Дошку не створено:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  updateBoard(title: string, id: number): Observable<HttpResponse<object>> {
    return this.http.put<HttpResponse<object>>(
      `${this.baseUrl}/${id}`,
      {title: title},
      {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      catchError((error) => {
        console.error('Помилка при оновленні дошки:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }
  removeBoard(id: number): Observable<HttpResponse<object>> {
    return this.http.delete<HttpResponse<object>>(
      `${this.baseUrl}/${id}`,
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }
}
