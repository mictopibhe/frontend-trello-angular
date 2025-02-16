import {inject, Injectable} from '@angular/core';
import {IAuthRequest} from '../core/interfaces/auth/AuthRequest.interface';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  baseUrl = `${environment.baseURL}/user`;

  register(data: IAuthRequest): Observable<HttpResponse<object>> {
    return this.http.post<HttpResponse<object>>(
      this.baseUrl,
      data
    ).pipe(

    );
  }
}
