import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from 'models/cliente.model';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {

  id?: number;
  cliente: Cliente = {
    cedula: '',
    nombres: '',
    apellidos: '',
    edad: 0,
    estadoCivil: '',
    telefono: '',
    observaciones: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.clienteService.obtener(this.id).subscribe(data => {
        this.cliente = data;
      });
    }
  }

guardar() {

  if (
    !this.cliente.cedula?.trim() ||
    !this.cliente.nombres?.trim() ||
    !this.cliente.apellidos?.trim() ||
    !this.cliente.estadoCivil?.trim() ||
    !this.cliente.telefono?.trim() ||
    this.cliente.edad <= 0
  ) {

    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Debe completar todos los campos obligatorios antes de guardar'
    });

    return;
  }

  console.log("OBJETO COMPLETO:", this.cliente);
  console.log("SI ENTRA");

  if (this.id) {

    this.clienteService.actualizar(this.id, this.cliente).subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Cliente actualizado',
          text: 'Los cambios se guardaron correctamente',
          showConfirmButton: false,
          timer: 5000,
          toast: true,
          position: 'top-end'
        });

        this.router.navigate(['/clientes']);

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.manejarError(err)
        });

      }

    });

  } else {

    this.clienteService.crear(this.cliente).subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Cliente creado',
          text: 'El cliente se guardó correctamente',
          showConfirmButton: false,
          timer: 5000,
          toast: true,
          position: 'top-end'
        });

        this.router.navigate(['/clientes']);

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.manejarError(err)
        });

      }

    });

  }

}

manejarError(err: any): string {

  if (err.error === "CEDULA_EXISTE") {
    return "La cédula ya existe";
  }

  return "La cédula ya existe";

}

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}
