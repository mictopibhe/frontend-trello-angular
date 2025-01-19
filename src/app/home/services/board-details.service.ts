import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {BoardDetails} from '../../core/interfaces/boardDetails.interface';


@Injectable({
  providedIn: 'root'
})
export class BoardDetailsService {
  http = inject(HttpClient);
  boardDetailsUrl = `${environment.baseURL}/board`;

  getBoardDetails(id: string): Observable<BoardDetails> {
    return this.http.get<BoardDetails>(
      `${this.boardDetailsUrl}/${id}`, {headers: {'Authorization': 'Bearer 123'}}
    );
  }
}
