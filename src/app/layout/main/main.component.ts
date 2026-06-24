import { DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterOutlet
} from '@angular/router';

import { CommonModule }
from '@angular/common';

import { ActivatedRoute }
from '@angular/router';

import { FormsModule }
 from '@angular/forms';

import { CasoService }
from 'clientes/services/caso.service';

import { EventoService }
from '../../services/evento.service';
import { NotificacionService } from 'services/notificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',

  standalone: true,

 imports: [
  RouterOutlet,
  DatePipe,
  CommonModule,
  FormsModule
],

  templateUrl: './main.component.html',

  styleUrls: ['./main.component.scss']
})

export class MainComponent
implements OnInit {

  // ======================================
  // VARIABLES
  // ======================================

  menuOpen = false;

  mostrarNotificaciones = false;
  
  mostrarModalEvento = false;

  mostrarEventos = false;

  notificaciones: any[] = [];

  casos: any[] = [];

  todosLosCasos: any[] = [];

  eventos: any[] = [];

  ultimaCantidadNotificaciones = 0;
  
  notificacionesVistas: string[] = [];

  cantidadNoVistas = 0;

  nuevoEvento = {

    id: null,

    titulo: '',

    descripcion: '',

    fecha: '',

    hora: '',

    tipo: 'AUDIENCIA',

    estado: 'PENDIENTE'

  };
  // ======================================
  // CONSTRUCTOR
  // ======================================

  constructor(

    private router: Router,

    private casoService: CasoService,

    private route: ActivatedRoute,

    private notificacionService: NotificacionService,

    private eventoService: EventoService

  ) {}



  username = localStorage.getItem('username') || 'Usuario';

get usuarioIniciales(): string {
  return this.username
    .split(' ')
    .map(x => x[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}


  // ======================================
  // INIT
  // ======================================

  ngOnInit(): void {

    this.cargarCasos();

    this.cargarEventos();

    this.casoService.notificacion$
      .subscribe(() => {

        this.cargarCasos();


      const vistasGuardadas =
      localStorage.getItem('notificacionesVistas');

      if (vistasGuardadas) {

        this.notificacionesVistas =
            JSON.parse(vistasGuardadas);

}

      });

  }

  // ======================================
  // LOGOUT
  // ======================================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

  // ======================================
  // NAVEGACIÓN
  // ======================================

  irHome(): void {

    this.router.navigate(['/home']);

  }

  irAClientes(): void {

    this.router.navigate(['/clientes']);

  }

  irACasos(estado?: string) {

  if (estado) {

    this.router.navigate(
      ['/casos'],
      {
        queryParams: {
          estado: estado
        }
      }
    );

  } else {

    this.router.navigate(['/casos']);

  }

}


  abrirCaso(id: number): void {

    this.mostrarNotificaciones = false;

    this.router.navigate(['/caso', id]);

  }

  // ======================================
  // MENÚ
  // ======================================

  toggleMenu(): void {

    this.menuOpen = !this.menuOpen;

  }

  cerrarMenu(event: any): void {

    const elemento =
      event.target as HTMLElement;

    if (
      elemento.closest('form') ||
      elemento.closest('button')
    ) {
      return;
    }

    this.menuOpen = false;

  }

  // ======================================
  // NOTIFICACIONES
  // ======================================

  toggleNotificaciones(): void {

    this.mostrarNotificaciones =
      !this.mostrarNotificaciones;

  }

  toggleEventos(): void {

    this.mostrarEventos =
      !this.mostrarEventos;

  }

  // ======================================
  // CERRAR TODO
  // ======================================

  @HostListener('document:click')
  cerrarTodo(): void {

    this.menuOpen = false;

    this.mostrarNotificaciones = false;

    this.mostrarEventos = false;

  }

  // ======================================
  // CARGAR CASOS
  // ======================================

cargarCasos(): void {

  const estado =
    this.route.snapshot.queryParamMap.get('estado');

  this.casoService
    .listar()
    .subscribe({

      next: (data) => {

  this.todosLosCasos = data;

  if (estado) {

    this.casos =
      data.filter(
        c => c.estado === estado
      );

  } else {

    this.casos = data;

  }

  this.actualizarNotificaciones();

},

      error: (err) => {

        console.error(err);

      }

    });

}

  // ======================================
  // CARGAR EVENTOS
  // ======================================

  cargarEventos(): void {

    this.eventoService
      .listar()
      .subscribe({

        next: (data) => {

          this.eventos = data;

          this.actualizarNotificaciones();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  // ======================================
  // ACTUALIZAR NOTIFICACIONES
  // ======================================

  actualizarNotificaciones(): void {

    const hoy = new Date();

    this.notificaciones = [];

    // ==================================
    // CASOS
    // ==================================

    this.todosLosCasos.forEach((caso: any) => {


       if (caso.estado === 'FINALIZADO') {
    return;
  }

      const limite =
        new Date(caso.fechaLimite);

      const inicio =
        new Date(caso.fechaInicio);

      const diasParaVencer =
        (limite.getTime() - hoy.getTime())
        /
        (1000 * 60 * 60 * 24);

      const diasSinMovimiento =
        (hoy.getTime() - inicio.getTime())
        /
        (1000 * 60 * 60 * 24);

      // 🔴 CRÍTICO
      if (diasParaVencer < -15) {

        this.notificaciones.push({

          ...caso,

          tipo: 'critico',

          mensaje: '🔴 Caso crítico'

        });

      }

      // ⚠️ VENCIDO
      else if (diasParaVencer < 0) {

        this.notificaciones.push({

          ...caso,

          tipo: 'vencido',

          mensaje: '⚠️ Caso vencido'

        });

      }

      // 🟡 PRÓXIMO
      else if (diasParaVencer <= 3) {

        this.notificaciones.push({

          ...caso,

          tipo: 'proximo',

          mensaje: '🟡 Caso por vencer'

        });

      }

      // 🔵 SIN MOVIMIENTO
      else if (

        diasSinMovimiento > 8

        &&

        caso.estado !== 'FINALIZADO'

      ) {

        this.notificaciones.push({

          ...caso,

          tipo: 'sin-movimiento',

          mensaje:
            '🔵 Caso sin movimiento'

        });

      }

    });

    // ==================================
    // EVENTOS
    // ==================================

    this.eventos.forEach((evento: any) => {

      const fechaEvento =
        new Date(evento.fecha);

      const diasEvento =
        (fechaEvento.getTime() - hoy.getTime())
        /
        (1000 * 60 * 60 * 24);

      // 🔔 EVENTO PRÓXIMO
      if (
        diasEvento <= 2 &&
        diasEvento >= 0
      ) {

        this.notificaciones.push({

          titulo: evento.titulo,

          mensaje:
            '📅 Evento próximo',

          fechaLimite: evento.fecha,

          tipo: 'evento',

          color:
            evento.tipo === 'AUDIENCIA'
              ? '#c62828'
              : '#1565c0',

          evento: true

        });

      }

    });

    // ==================================
    // ORDENAR
    // ==================================

    this.notificaciones.sort(
      (a: any, b: any) => {

        return (
          new Date(a.fechaLimite).getTime()
          -
          new Date(b.fechaLimite).getTime()
        );

      }
    );

    // ==================================
    // ALERTA
    // ==================================

   const nuevas = this.notificaciones.filter(
  n => !this.notificacionesVistas.includes(
    `${n.id}-${n.tipo}`
  )
);

this.cantidadNoVistas = nuevas.length;

if (nuevas.length > 0) {

  Swal.fire({
    icon: 'info',
    title: '🔔 Nuevas notificaciones',
    text: `Tienes ${nuevas.length} notificaciones nuevas`,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000
  });

}

      this.notificacionService.setNotificaciones(
    this.notificaciones)

  }

  // ======================================
  // EDITAR EVENTO
  // ======================================

 editarEvento(evento: any): void {

  console.log('Editar evento:', evento);

  this.nuevoEvento = {
    id: evento.id,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    fecha: evento.fecha,
    hora: evento.hora,
    tipo: evento.tipo,
    estado: evento.estado
  };

  this.mostrarModalEvento = true;

}

  // ======================================
  // ELIMINAR EVENTO
  // ======================================

eliminarEvento(item: any): void {

  Swal.fire({
    title: '¿Eliminar evento?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {

      const evento = item.data;

      this.eventoService
        .eliminar(evento.id)
        .subscribe({

          next: () => {

            this.cargarEventos();

            Swal.fire({
              icon: 'success',
              title: 'Evento eliminado',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });

          },

          error: (err) => {

            console.error(err);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el evento'
            });

          }

        });

    }

  });

}

marcarNotificacionesComoVistas(): void {

  this.notificaciones.forEach(n => {

    const clave = `${n.id}-${n.tipo}`;

    if (!this.notificacionesVistas.includes(clave)) {

      this.notificacionesVistas.push(clave);

    }

  });

  localStorage.setItem(
    'notificacionesVistas',
    JSON.stringify(this.notificacionesVistas)
  );

  this.cantidadNoVistas = 0;

}


  cerrarModalEvento(): void {

    this.mostrarModalEvento = false;

  }

}