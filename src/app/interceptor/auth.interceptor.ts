import {
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import { Router } from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('🔥 INTERCEPTOR EJECUTADO');

  const router = inject(Router);

  const token = localStorage.getItem('token');

  console.log('TOKEN:', token);

  // NO agregar token al login
  if (
    token &&
    !req.url.includes('/api/auth/login')
  ) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ TOKEN AGREGADO');
  }

  return next(req).pipe(

    catchError((error) => {

  console.log('🚨 ERROR INTERCEPTADO');
  console.log(error);

  const esLogin =
    req.url.includes('/api/auth/login');

  if (
    error.status === 401 &&
    !esLogin
  ) {

    localStorage.removeItem('token');

    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Debe iniciar sesión nuevamente'
    });

    router.navigate(['/login']);

  }

  return throwError(() => error);

})

  );

};