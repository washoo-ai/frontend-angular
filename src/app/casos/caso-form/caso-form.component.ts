import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { CasoService } from 'clientes/services/caso.service';
import { ClienteService } from 'clientes/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caso-form',
  templateUrl: './caso-form.component.html',
  styleUrls: ['./caso-form.component.scss']
})
export class CasoFormComponent {
   clientes: any[] = [];

textoCliente: string = '';

clientesFiltrados: any[] = [];
caso: any = {
  titulo: '',
  descripcion: '',
  estado: '',
  fechaInicio: '',
  fechaLimite: '',
  cliente: {
    id: null
  }
};

  constructor(
    private clienteService: ClienteService,
    private casoService: CasoService,
      private route: ActivatedRoute,
  
    private router: Router
    
  ) {}
ngOnInit() {

  this.cargarClientes();

  const id = this.route.snapshot.paramMap.get('id');

  if (id) {

    this.casoService.obtener(+id).subscribe(data => {

      this.caso = data;

      // fechas para input type="date"
      this.caso.fechaInicio =
        data.fechaInicio?.substring(0, 10);

      this.caso.fechaLimite =
        data.fechaLimite?.substring(0, 10);

      // cliente seleccionado
      if (data.cliente) {

        this.textoCliente =
          `${data.cliente.nombres} ${data.cliente.apellidos} `;

      }

    });

  }

}

cargarClientes() {

  this.clienteService
    .listar()
    .subscribe(data => {

      this.clientes = data.map((c: any) => ({

        ...c,

        textoBusqueda:
          `${c.nombres} ${c.apellidos} ${c.cedula}`

      }));

    });

}


editar(id: number) {
  this.router.navigate(['/casos/editar', id]);
}

guardar() {

  if (
    !this.caso.titulo?.trim() ||
    !this.caso.descripcion?.trim() ||
    !this.caso.estado?.trim() ||
    !this.caso.fechaInicio ||
    !this.caso.fechaLimite ||
    !this.caso.cliente?.id
  ) {

    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Debe completar todos los campos obligatorios antes de guardar'
    });

    return;
  }

  if (this.caso.fechaInicio > this.caso.fechaLimite) {

    Swal.fire({
      icon: 'error',
      title: 'Fechas inválidas',
      text: 'La fecha de inicio no puede ser mayor que la fecha límite'
    });

    return;
  }

  const casoEnviar = {

    ...this.caso,

    fechaInicio: this.caso.fechaInicio.includes('T')
      ? this.caso.fechaInicio
      : this.caso.fechaInicio + 'T12:00:00',

    fechaLimite: this.caso.fechaLimite.includes('T')
      ? this.caso.fechaLimite
      : this.caso.fechaLimite + 'T12:00:00'

  };

  console.log(casoEnviar);

  if (this.caso.id) {

    this.casoService
      .actualizar(this.caso.id, casoEnviar)
      .subscribe({

        next: () => {

          this.casoService.notificarCambio();

          Swal.fire({
            icon: 'success',
            title: 'Caso actualizado',
            text: 'Los cambios se guardaron correctamente',
            showConfirmButton: false,
            timer: 5000,
            toast: true,
            position: 'top-end'
          });

          this.router.navigate(['/casos']);

        },

        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el caso'
          });

          console.error(err);

        }

      });

  } else {

    this.casoService
      .crear(casoEnviar)
      .subscribe({

        next: () => {

          this.casoService.notificarCambio();

          Swal.fire({
            icon: 'success',
            title: 'Caso creado',
            text: 'El caso se creó correctamente',
            showConfirmButton: false,
            timer: 5000,
            toast: true,
            position: 'top-end'
          });

          this.router.navigate(['/casos']);

        },

        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el caso'
          });

          console.error(err);

        }

      });

  }

}
filtrarClientes(): void {

   console.log('Texto:', this.textoCliente);
  console.log('Clientes:', this.clientes);

  if (!this.textoCliente || this.textoCliente.length < 2) {

    this.clientesFiltrados = [];

    return;

  }

  const texto = this.textoCliente.toLowerCase();

  this.clientesFiltrados = this.clientes.filter(c =>

    c.nombres.toLowerCase().includes(texto)
    ||
    c.apellidos.toLowerCase().includes(texto)
    ||
    c.cedula.includes(texto)

  );

}

seleccionarCliente(cliente: any): void {

  this.caso.cliente.id = cliente.id;

  this.textoCliente =
    `${cliente.nombres} ${cliente.apellidos} - ${cliente.cedula}`;

  this.clientesFiltrados = [];

}


cancelar() {
    this.router.navigate(['/casos']);
  }
}


