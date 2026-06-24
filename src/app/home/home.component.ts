import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { FullCalendarModule } from '@fullcalendar/angular';

import { Calendar } from '@fullcalendar/core';

import dayGridPlugin
from '@fullcalendar/daygrid';

import interactionPlugin
from '@fullcalendar/interaction';

import esLocale
from '@fullcalendar/core/locales/es';

import { CasoService }
from 'clientes/services/caso.service';

import { EventoService }
from '../services/evento.service';

import { NotificacionService }
from '../services/notificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule
  ],

  templateUrl: './home.component.html',

  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  usuario = '';

  calendar: any;

  fechas: any[] = [];

  eventos: any[] = [];

  descripcionSeleccionada = '';

  mostrarModal = false;

  mostrarModalEvento = false;

  mostrarNotificaciones = false;

  modalNota = false;

  notaTexto = '';

  notificaciones:any[] = [];

  casoSeleccionado: any = null;

  nuevoEvento = {

    titulo: '',

    descripcion: '',

    fecha: '',

    hora: '',

  

    tipo: 'AUDIENCIA',

    estado: 'PENDIENTE'

  };

  datos = {

    casosActivos: 0,

    clientes: 0,

    enProceso: 0,

    finalizados: 0,

    notificaciones: 0

  };

  constructor(

    private router: Router,

    @Inject(PLATFORM_ID)
    private platformId: Object,

    private casoService: CasoService,

    private notificacionService: NotificacionService,

    private eventoService: EventoService

  ) {}
ngOnInit(): void {

  if (isPlatformBrowser(this.platformId)) {

    this.usuario =
      localStorage.getItem('usuario')
      || 'Usuario';

  }

  // Escuchar notificaciones
  this.notificacionService.notificaciones$
    .subscribe(data => {

      this.notificaciones = data;

    });

  this.cargarResumenCasos();

  this.cargarFechas();

  this.cargarEventos();

}
  // =========================================
  // LOGOUT
  // =========================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  // =========================================
  // NAVEGACIÓN
  // =========================================

  irClientes(): void {

    this.router.navigate(['/clientes']);

  }

  irACasos(estado: string): void {

    this.router.navigate(
      ['/casos'],
      {
        queryParams: { estado }
      }
    );

  }
       abrirCaso(id: number): void {

    this.mostrarNotificaciones = false;

    this.router.navigate(['/caso', id]);

  }
  // =========================================
  // RESUMEN
  // =========================================

  cargarResumenCasos(): void {

    this.casoService
      .resumen()
      .subscribe({

        next: (data) => {

          this.datos.casosActivos =
            data.activos;

          this.datos.enProceso =
            data.proceso;

          this.datos.finalizados =
            data.finalizados;

        },

        error: (err) =>
          console.error(err)

      });

  }

  // =========================================
  // FECHAS CASOS
  // =========================================

  cargarFechas(): void {

    this.casoService
      .obtenerFechas()
      .subscribe({

        next: (data) => {

          this.fechas = data

            .filter(
              (c: any) =>
                c.estado !== 'FINALIZADO'
            )

            .sort(
              (a: any, b: any) =>
                new Date(a.fechaLimite).getTime()
                -
                new Date(b.fechaLimite).getTime()
            );

          this.renderCalendar();

        },

        error: (err) =>
          console.error(err)

      });

  }

  // =========================================
  // EVENTOS
  // =========================================

  cargarEventos(): void {

    this.eventoService
      .listar()
      .subscribe({

        next: (data) => {

          this.eventos = data;

          this.renderCalendar();

        },

        error: (err) =>
          console.error(err)

      });

  }

  guardarEvento(): void {

  if (
    !this.nuevoEvento.titulo?.trim() ||
    !this.nuevoEvento.descripcion?.trim() ||
    !this.nuevoEvento.fecha ||
    !this.nuevoEvento.hora
  ) {

  Swal.fire({
  icon: 'warning',
  title: 'Campos incompletos',
  text: 'Debe completar todos los campos obligatorios',
  target: document.body,
  backdrop: true
});

    return;
  }

  this.eventoService
    .crear(this.nuevoEvento)
    .subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Evento creado',
          text: 'Creado correctamente',
          showConfirmButton: false,
          timer: 5000,
          toast: true,
          position: 'top-end'
        });

        this.mostrarModalEvento = false;

        this.cargarEventos();

        // Limpiar formulario
        this.nuevoEvento = {
          titulo: '',
          descripcion: '',
          fecha: '',
          hora: '',
          tipo: 'AUDIENCIA',
          estado: 'PENDIENTE'
        };

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el evento'
        });

        console.error(err);

      }

    });

}

  abrirModalEvento(fecha: string): void {

    this.nuevoEvento = {

      titulo: '',

      descripcion: '',

      fecha: fecha,

      hora: '',

      tipo: 'AUDIENCIA',

      estado: 'PENDIENTE'

    };

    this.mostrarModalEvento = true;

  }

  cerrarModalEvento(): void {

    this.mostrarModalEvento = false;

  }

  // =========================================
  // CALENDARIO
  // =========================================

  renderCalendar(): void {

    const calendarEl =
      document.getElementById('calendar');

    if (!calendarEl) return;

    calendarEl.innerHTML = '';

    this.calendar = new Calendar(calendarEl, {

      plugins: [
        dayGridPlugin,
        interactionPlugin
      ],

      initialView: 'dayGridMonth',

      locale: esLocale,

      timeZone: 'local',

      displayEventTime: false,

      dateClick: (info) => {

        this.abrirModalEvento(
          info.dateStr
        );

      },

      eventClick: (info) => {

        this.abrirNota(info.event);

      },

      events: [

        // CASOS
        ...this.fechas.map(caso => ({

          title: caso.titulo,

          date: caso.fechaLimite,

          color:
            this.getColor(caso.estado),

          extendedProps: {

            id: caso.id,

            tipo: 'CASO'

          }

        })),

        // EVENTOS
        ...this.eventos.map(evento => ({

          title: evento.titulo,

          date: evento.fecha,

          color:
            evento.tipo === 'AUDIENCIA'
              ? '#d32f2f'
              : '#1976d2',

          extendedProps: {

            id: evento.id,

            tipo: 'EVENTO'

          }

        }))

      ],

      eventDidMount: (info) => {

        const id =
          info.event.extendedProps?.['id'];

        let tooltip:
          HTMLDivElement | null = null;

        info.el.addEventListener(
          'mouseenter',
          (e: MouseEvent) => {

            const notas =
              JSON.parse(
                localStorage.getItem('notas')
                || '{}'
              );

            const nota = notas[id];

            if (!nota) return;

            tooltip =
              document.createElement('div');

            tooltip.className =
              'tooltip-nota';

            tooltip.innerText = nota;

            document.body.appendChild(
              tooltip
            );

            tooltip.style.top =
              (e.clientY + 10) + 'px';

            tooltip.style.left =
              (e.clientX + 10) + 'px';

          }
        );

        info.el.addEventListener(
          'mousemove',
          (e: MouseEvent) => {

            if (tooltip) {

              tooltip.style.top =
                (e.clientY + 10) + 'px';

              tooltip.style.left =
                (e.clientX + 10) + 'px';

            }

          }
        );

        info.el.addEventListener(
          'mouseleave',
          () => {

            if (tooltip) {

              tooltip.remove();

              tooltip = null;

            }

          }
        );

      }

    });

    this.calendar.render();

  }

  // =========================================
  // NOTAS
  // =========================================

  abrirNota(event: any): void {

    const id =
      event.extendedProps?.id;

    this.modalNota = true;

    this.casoSeleccionado = id;

    const notas =
      JSON.parse(
        localStorage.getItem('notas')
        || '{}'
      );

    this.notaTexto =
      notas[id] || '';

  }

  guardarNota(texto: string): void {

    const notas =
      JSON.parse(
        localStorage.getItem('notas')
        || '{}'
      );

    notas[this.casoSeleccionado] =
      texto;

    localStorage.setItem(
      'notas',
      JSON.stringify(notas)
    );

    this.cerrarNota();

  }

  cerrarNota(): void {

    this.modalNota = false;

    this.notaTexto = '';

    this.casoSeleccionado = null;

  }

  // =========================================
  // MODAL DESCRIPCIÓN
  // =========================================

  verDescripcion(caso: any): void {

    this.descripcionSeleccionada =
      caso.descripcion;

    this.mostrarModal = true;

  }

  cerrarModal(): void {

    this.mostrarModal = false;

  }

  // =========================================
  // UTILIDADES
  // =========================================

  getColor(estado: string): string {

    if (estado === 'ACTIVO')
      return '#0de740';

    if (estado === 'EN_PROCESO')
      return '#ffbf00';

    if (estado === 'FINALIZADO')
      return '#6c757d';

    return '#007bff';

  }

  getDiasRestantes(
    fecha: string
  ): number {

    const hoy = new Date();

    const limite = new Date(fecha);

    const diff =
      limite.getTime()
      -
      hoy.getTime();

    return Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

  }

}