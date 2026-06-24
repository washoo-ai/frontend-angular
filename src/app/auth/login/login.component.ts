import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
   imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData = {
    username: '',
    password: ''
  };

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  
  onLogin() {

  this.authService.login(this.loginData).subscribe({

    next: (response: any) => {

      console.log('RESPUESTA:', response);

      this.authService.saveToken(response.token);

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión correcto',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/home']);

    },

    error: (err) => {

      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Usuario o contraseña incorrectos'
      });

    }

  });

}

}
