import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  baseUrl = `${environment.baseURL}/board`;

  constructor(private http: HttpClient) {}

  createCard(
    boardId: string, listId: number,
    cardTitle: string, cardDescription: string,
    pos: number
  ): Observable<HttpResponse<object>> {
    return this.http.post<HttpResponse<object>>(
      `${this.baseUrl}/${boardId}/card`,
      {
        title: cardTitle,
        list_id: listId,
        position: pos,
        description: cardDescription
      },
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }
}
