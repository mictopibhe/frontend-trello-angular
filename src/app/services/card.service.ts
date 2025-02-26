import {inject, Injectable} from '@angular/core';
import {catchError, EMPTY, Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ICardsList} from '../core/interfaces/cardList.interface';
import {ICard} from '../core/interfaces/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private http = inject(HttpClient);
  baseUrl = `${environment.baseURL}`;

  createCard(
    newCard: { title: string; description: string }, boardId: number, listId: number, pos: number
  ): Observable<HttpResponse<object>> {
    return this.http.post<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/card`,
      {
        ...newCard,
        list_id: listId,
        position: pos
      },
      {headers: {'Authorization': 'Bearer 123'}}
    ).pipe(
      catchError((error) => {
        console.error('Невдалося створити картку:', error);
        return EMPTY;
      })
    );
  }

  updateCards(boardId: number, listId: number, cards: ICard[]): Observable<HttpResponse<object>> {
    const payload: { id: number, position: number, list_id: number }[] = cards
      .map((card) => {
        return {
          id: card.id,
          position: card.position,
          list_id: listId
        }
      });
    return this.http.put<HttpResponse<object>>(
      `${this.baseUrl}/board/${boardId}/card`,
      payload,
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }
}
