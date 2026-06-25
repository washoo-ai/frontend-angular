import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../models/login-request';
import { FormsModule } from '@angular/forms';
@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(
      `${this.api}/login`,
      data,
      { responseType: 'text' }
    );
  }
}
