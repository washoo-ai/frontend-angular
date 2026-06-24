import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';

import { Router } from '@angular/router';

import { Cliente } from 'models/cliente.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {

  clientes: Cliente[] = [];
  textoBusqueda = '';
clientesFiltrados: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

 cargarClientes() {
  this.clienteService.listar().subscribe(data => {

    this.clientes = data;

    // 🔥 LISTA ORIGINAL
    this.clientesFiltrados = data;

  });
}
filtrarClientes() {

  const texto = this.textoBusqueda
    .toLowerCase()
    .trim();

  this.clientesFiltrados = this.clientes.filter(c =>

    c.nombres?.toLowerCase().includes(texto) ||
    c.apellidos?.toLowerCase().includes(texto) ||
    c.cedula?.toLowerCase().includes(texto) ||
    c.telefono?.toLowerCase().includes(texto)

  );
}

  editar(id: number) {
    this.router.navigate(['/clientes/editar', id]);
  }

 eliminar(id: number) {

  Swal.fire({
    title: '¿Eliminar cliente?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {

      this.clienteService
        .eliminar(id)
        .subscribe({

          next: () => {

            this.cargarClientes();

            Swal.fire({
              icon: 'success',
              title: 'Cliente eliminado',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });

          },

          error: () => {

            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar',
              text: 'El cliente tiene casos asociados'
            });

          }

        });

    }

  });

}

  nuevo() {
    this.router.navigate(['/clientes/nuevo']);
  }
}
