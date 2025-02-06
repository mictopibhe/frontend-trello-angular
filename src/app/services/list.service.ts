import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, EMPTY, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private http = inject(HttpClient);
  baseUrl = `${environment.baseURL}`;

  createList(boardId: number, title: string, pos: number = 1): Observable<HttpResponse<object>> {
    return this.http.post<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/list`,
      {title: title, position: pos},
      {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      catchError((error) => {
        console.error('Невдалося створити новий список:', error);
        return EMPTY;
      })
    );
  }

  updateListTitle(title: string, boardId: number, listId: number): Observable<HttpResponse<object>> {
    return this.http.put<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/list/${listId}`,
      {title: title},
      {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      catchError((error) => {
        console.error('Невдалося оновити дошку:', error);
        return EMPTY;
      })
    );
  }

  removeList(boardId: number, listId: number): Observable<HttpResponse<object>> {
    return this.http.delete<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/list/${listId}`,
      {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      catchError((error) => {
        console.error('Невдалося видалити дошку:', error);
        return EMPTY;
      })
    );
  }
}
