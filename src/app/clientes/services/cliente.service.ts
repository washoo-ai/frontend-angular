import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from 'models/cliente.model';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  //private apiUrl = 'http://localhost:8080/api/clientes';
  private apiUrl = `${environment.apiUrl}/api/clientes`;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // 🔥 Método SEGURO para obtener el token sin romper SSR
  private getToken(): string | null {
    // ⛔ En Angular Universal (SSR) NO existe window/localStorage
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('token');
  }

  // 🔥 Headers seguros (no fallan en SSR)
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // Listar todos los clientes
  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Crear cliente
  crear(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener cliente por ID
  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar cliente
  actualizar(id: number, cliente: Cliente): Observable<Cliente> {
    const clienteRequest = {
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      cedula: cliente.cedula,
      edad:cliente.edad,
      estadoCivil:cliente.estadoCivil,
      telefono:cliente.telefono,
      observaciones:cliente.observaciones
     
    };

    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, clienteRequest, {
      headers: this.getAuthHeaders()
    });
  }

  // Eliminar cliente
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
