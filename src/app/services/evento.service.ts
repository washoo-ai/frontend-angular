import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { Evento }
from '../models/evento.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  
    private apiUrl = `${environment.apiUrl}/eventos`;

  constructor(
    private http: HttpClient
  ) {}

  private getHeaders() {

    const token =
      localStorage.getItem('token');

    return {

      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })

    };

  }

  listar(): Observable<Evento[]> {

    return this.http.get<Evento[]>(
      this.api,
      this.getHeaders()
    );

  }

  crear(evento: Evento) {

    return this.http.post(
      this.api,
      evento,
      this.getHeaders()
    );

  }
  eliminar(id: number) {

  return this.http.delete(

    `${this.api}/${id}`,

    this.getHeaders()

  );
}
actualizar(id: number, evento: any) {

  return this.http.put(
    `${this.api}/${id}`,
    evento,
    this.getHeaders()
  );

}

}
