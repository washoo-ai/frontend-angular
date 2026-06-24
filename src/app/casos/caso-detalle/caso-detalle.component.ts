import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasoService } from 'clientes/services/caso.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-caso-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './caso-detalle.component.html',
  styleUrls: ['./caso-detalle.component.scss']
})
export class CasoDetalleComponent implements OnInit {

  caso: any;

  constructor(
    private route: ActivatedRoute,
    private casoService: CasoService
  ) {}

  ngOnInit(): void {



    
  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    if (id) {

      this.casoService.obtener(Number(id))
        .subscribe({

          next: (data) => {

            this.caso = data;

               // FORMATEAR FECHA
            if (this.caso.fechaLimite) {

              this.caso.fechaLimite =
                this.caso.fechaLimite.split('T')[0];

            }



          },

          error: (err) => {

            console.error(
              'Error al obtener caso',
              err
            );

          }

        });

    }

  });

}
  guardarCambios(): void {

    this.casoService.actualizar(
      this.caso.id,
      this.caso
    ).subscribe({

      next: () => {

         Swal.fire({
          icon: 'success',
          title: 'Caso actualizado',
          text: 'Los cambios se guardaron correctamente',
          showConfirmButton: false,
          timer: 5000,
          toast: true,
          position: 'top-end'
        });

      },

      error: (err) => {

        console.error('Error al actualizar', err);

      }

    });

  }
descargarPDF(): void {

  const pdf = new jsPDF('p', 'mm', 'a4');

  const descripcion =
    this.caso.descripcion || 'Sin descripción';

  // DATOS
  const titulo =
    `Caso :${this.caso.titulo}`;

  const fechaLimite =
    `Fecha :${this.caso.fechaLimite}`;

  const estado =
    `Estado: ${this.caso.estado}`;

  const cliente =
    `Cliente: ${this.caso.cliente?.nombres} ${this.caso.cliente?.apellidos}`;

  // CONFIGURACIÓN
  const marginLeft = 20;

  let posY = 20;

  const pageHeight =
    pdf.internal.pageSize.height;

 // ===== TITULO DEL CASO =====
pdf.setFontSize(20);

pdf.setTextColor(15, 23, 42);

pdf.text(
  titulo,
  marginLeft,
  posY
);

// ===== FECHA LÍMITE (DERECHA) =====
pdf.setFontSize(12);

pdf.setTextColor(100);

pdf.text(
  `Fecha límite: ${this.caso.fechaLimite}`,
  140,
  posY
);

// ESPACIO
posY += 12;

// ===== CLIENTE =====
pdf.setFontSize(13);

pdf.setTextColor(60);

pdf.text(
  cliente,
  marginLeft,
  posY
);

// LINEA SEPARADORA
posY += 10;

pdf.setDrawColor(220);

pdf.line(
  marginLeft,
  posY,
  190,
  posY
);

// ESPACIO ANTES DESCRIPCIÓN
posY += 15;

  // TITULO DESCRIPCIÓN
  pdf.setFontSize(14);

  pdf.text('Descripción:', marginLeft, posY);

  posY += 10;

  // TEXTO DIVIDIDO
  pdf.setFontSize(12);

  const lineas =
    pdf.splitTextToSize(
      descripcion,
      170
    );

  // ESCRIBIR LÍNEA POR LÍNEA
  lineas.forEach((linea: string) => {

    // SI YA NO CABE -> NUEVA PÁGINA
    if (posY > pageHeight - 20) {

      pdf.addPage();

      posY = 20;

    }

    pdf.text(linea, marginLeft, posY);

    posY += 7;

  });

  // DESCARGAR
  pdf.save(`caso-${this.caso.id}.pdf`);

}

}