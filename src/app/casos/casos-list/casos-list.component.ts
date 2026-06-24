import { Component, OnInit } from '@angular/core';
import { CasoService } from 'clientes/services/caso.service';
import { FormsModule } from '@angular/forms';
import { Caso } from 'models/caso.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-caso-list',
  templateUrl: './caso-list.component.html',
  styleUrls: ['./caso-list.component.scss']
})
export class CasoListComponent implements OnInit {

  casos: Caso[] = [];
  fechas: any[] = [];
  mostrarBusqueda = false;
  textoBusqueda = '';
  casosFiltrados: any[] = [];
  

  constructor(private casoService: CasoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

 
 

ngOnInit(): void {

  this.route.queryParams.subscribe(params => {
    
   

    const estado = params['estado'];
    
   

    if (estado) {
      this.casoService.obtenerPorEstado(estado).subscribe(data => {
         
        this.casos = data;
         this.casosFiltrados = data;
      });
    } else {
      this.casoService.listar().subscribe(data => {
         this.casosFiltrados = data;
        this.casos = data;
        this.cargarFechas();
      });
    }
  }
);

}

validarCasos(data: Caso[]): Caso[] {
  return data.map(caso => {

    const inicio = new Date(caso.fechaInicio);
    const limite = new Date(caso.fechaLimite);

    if (inicio > limite) {
      console.warn("⚠️ Corrigiendo caso con fechas inválidas:", caso);

      // 🔥 FORZAR coherencia
      const temp = caso.fechaInicio;
      caso.fechaInicio = caso.fechaLimite;
      caso.fechaLimite = temp;
    }

    return caso;
  });
}



filtrarCasos() {

  const texto = this.textoBusqueda
    .toLowerCase()
    .trim();

  this.casosFiltrados = this.casos.filter(c =>

    c.titulo?.toLowerCase().includes(texto) ||

    c.descripcion?.toLowerCase().includes(texto) ||

    c.estado?.toLowerCase().includes(texto) ||

    c.cliente?.nombres?.toLowerCase().includes(texto) ||

    c.cliente?.apellidos?.toLowerCase().includes(texto)

  );
}
toggleBusqueda() {
  this.mostrarBusqueda = !this.mostrarBusqueda;

  if (!this.mostrarBusqueda) {
    this.textoBusqueda = '';
    this.casosFiltrados = this.casos; // 🔥 vuelve a lista original
  }
}

  cargarCasos() {
    this.casoService.listar().subscribe({
  next: (data) => {
    //this.casos = data;
       // 🔥 actualizar la tabla
      this.casosFiltrados = [...data];
  },
  error: (err) => {
    console.log('ERROR CONTROLADO');
  }
})

    ;
  }


/// mostar mas y mostar menos 
toggleDescripcion(caso: any) {
  caso.mostrarCompleto = !caso.mostrarCompleto;
}


/// modal de vcer descripcion
modalAbierto = false;
descripcionSeleccionada = '';

abrirModal(descripcion: string) {
  this.descripcionSeleccionada = descripcion;
  this.modalAbierto = true;
}

cerrarModal() {
  this.modalAbierto = false;
}

cargarFechas() {
  this.casoService.obtenerFechas().subscribe({
    next: (data) => {
      this.fechas = data;
      console.log("Fechas:", data); // debug
    },
    error: (err) => console.error(err)
  });
}

  filtrarPorEstado(estado: string) {
  this.casoService.obtenerPorEstado(estado).subscribe(data => {
    
    this.casos = data;
  });
}

editar(id: number) {
  this.router.navigate(['/casos/editar', id]);
}

eliminar(id: number) {

  Swal.fire({
    title: '¿Eliminar caso?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {

      this.casoService
        .eliminar(id)
        .subscribe(() => {

          this.cargarCasos();

          Swal.fire({
            icon: 'success',
            title: 'Caso eliminado',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          });

        });

    }

  });

}
  
}
