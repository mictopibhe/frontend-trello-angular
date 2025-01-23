import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  baseUrl = `${environment.baseURL}/board`;
  boardId: string | null = null;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  createCard(listId: string, inputValue: string, pos: number): Observable<HttpResponse<object>> {
    this.boardId = this.route.snapshot.paramMap.get('id');
    return this.http.post<HttpResponse<object>>(
      `${this.baseUrl}/${this.boardId}/card`,
      {
        title: inputValue,
        list_id: listId,
      }
    )
  }
}
