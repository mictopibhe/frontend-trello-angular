import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {map, Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Board} from '../../core/interfaces/board.interface';
import {BoardDetails} from '../../core/interfaces/boardDetails.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  http = inject(HttpClient);
  boardUrl = `${environment.baseURL}/board`;

  getBoards(): Observable<Board[]> {
    return this.http.get<{ boards: Board[] }>(
      this.boardUrl, {headers: {'Authorization': 'Bearer 123'}}
    )
      .pipe(
        map(response => response.boards)
      )
  }

  //todo: обробити помилку з сервера коли дошка з такою назвою існує
  createBoard(title: string): Observable<HttpResponse<object>> {
    const board: NewBoard = {
      title: title,
      custom: {backgroundColor: this.generateRandomColor()}
    };
    return this.http.post<HttpResponse<object>>(
      this.boardUrl,
      board,
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }

  updateBoard(newTitle: string, boardId: string): Observable<HttpResponse<object>> {
    return this.http.put<HttpResponse<object>>(
      `${this.boardUrl}/${boardId}`,
      {title: newTitle},
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }

  removeBoard(boardId: string): Observable<HttpResponse<object>> {
    return this.http.delete<HttpResponse<object>>(
      `${this.boardUrl}/${boardId}`,
      {headers: {'Authorization': 'Bearer 123'}}
    );
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

interface NewBoard {
  title: string;
  custom: { backgroundColor: string };
}
