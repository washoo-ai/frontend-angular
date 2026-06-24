import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../models/login-request';
import { FormsModule } from '@angular/forms';
@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.api}/login`,
      { username, password },
      { responseType: 'text' } // ⬅️ MUY IMPORTANTE
    );
  }
 saveToken(token: string) {
  localStorage.setItem('token', token);
}
}
