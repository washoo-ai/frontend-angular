import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Caso } from 'models/caso.model';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CasoService {
  obtenerCasoPorId(id: string | null) {
    throw new Error('Method not implemented.');
  }

  private apiUrl = `${environment.apiUrl}/casos`;
  

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log("TOKEN:", token); // 👈 IMPORTANTE
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
private getToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
}


private notificacionSubject = new Subject<void>();

notificacion$ = this.notificacionSubject.asObservable();

notificarCambio() {
  this.notificacionSubject.next();
}


listar(): Observable<Caso[]> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
  });

  return this.http.get<Caso[]>(this.apiUrl, { headers });
}
  crear(caso: Caso): Observable<Caso> {
    return this.http.post<Caso>(this.apiUrl, caso, this.getAuthHeaders());
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
  actualizar(id: number, caso: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, caso, this.getAuthHeaders());
}

  obtener(id: number): Observable<Caso> {
    return this.http.get<Caso>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
  obtenerFechas() {
  return this.http.get<any[]>(`${this.apiUrl}/fechas`);
}

  resumen() {
  return this.http.get<any>(`${environment.apiUrl}/casos/resumen`);
}

obtenerPorEstado(estado: string) {
 return this.http.get<any[]>(`${environment.apiUrl}/casos/estado/${estado}`);
}





}