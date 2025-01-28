import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  baseUrl = `${environment.baseURL}`;

  constructor(private http: HttpClient) {
  }

  createList(boardId: string, listTitle: string, pos: number): Observable<HttpResponse<object>> {
    return this.http.post<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/list`,
      {
        title: listTitle,
        position: pos,
      },
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }

  removeList(listId: number, boardId: string): Observable<HttpResponse<object>> {
    return this.http.delete<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/list/${listId}`,
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }

  updateListTitle(listId: number, boardId: string, newTitle: string): Observable<HttpResponse<object>> {
    return this.http.put<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/list/${listId}`,
      {title: newTitle},
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }
}
