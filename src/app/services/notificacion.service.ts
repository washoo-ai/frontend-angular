import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private notificacionesSubject =
    new BehaviorSubject<any[]>([]);

  notificaciones$ =
    this.notificacionesSubject.asObservable();

  setNotificaciones(
    notificaciones: any[]
  ): void {

    this.notificacionesSubject.next(
      notificaciones
    );

  }

}