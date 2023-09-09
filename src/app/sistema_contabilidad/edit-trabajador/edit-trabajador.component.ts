import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-edit-trabajador',
  templateUrl: './edit-trabajador.component.html',
  styleUrls: ['./edit-trabajador.component.css'],
})
export class EditTrabajadorComponent implements OnInit {
  idObtenido: any;
  nomina: any = {};
  fechaActual: Date = new Date();
  displayedColumns: string[] = [
    "tipo",
    "clave",
    "concepto",
    "importe",
    "importe_gravado",
    "exento_isr",
    "gravado_imss",
    "exento_imss"
  ];
  displayedColumns2: string[] = [
    "tipo",
    "clave",
    "concepto",
    "importe",
  ];


  dataSource: any[] = [];
  dataSource2: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private calculoService: CalculoService,
  ) {}

  @ViewChild('paraPDF', { static: false })
  paraPDF!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.cargautil();
    this.fechaActual = new Date();


  }

  cargautil() {
    // Obtener los datos del empleado desde la ruta activa
    this.route.queryParams.subscribe((params) => {
      this.idObtenido = params;
      console.log('this.idObtenido :>> ', this.idObtenido);
    });
    this.obtenerRegistros();
  }

// Mapeo de columnas a formatear
columnasFormateadas: { [key: string]: boolean } = {
  importe: true,
  importe_gravado: true,
  exento_imss: true,
  exento_isr : true,
  gravado_imss: true,
};







  // ENVIAR ID_BOVEDA
  obtenerRegistros() {
    let json = {
      id_boveda: 350006, // <= cambiar por id_boveda
    };
    this.calculoService.detalleXML(json).subscribe((obj: any) => {
      if (obj.ok) {
        // Asigna los datos y realiza filtros
        this.dataSource2 = obj.data.filter((element:any) => element.tipo === 'D');
        this.dataSource = obj.data;
        this.nomina = obj.data;

        console.log('object :>> ', this.nomina);
      } else {
        // Manejo de error o mensaje de que no se encontraron datos
      }
    });

  }

 getfecha(): Date{
  return new Date();
 }


 // EXPORTAR PDF
  exportarAPDF() {


    const content: HTMLElement = this.paraPDF.nativeElement;
    const pdf = new jsPDF('landscape', 'mm', 'a4'); // Cambia 'landscape' para orientación horizontal
    const pdfOptions = {
      margin: 10,
      filename: 'trabajadores-XML.pdf',
    };

    // Muestra la alerta de progreso
    Swal.fire({
      title: 'Generando PDF',
      text: 'Por favor, espere...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    // Genera el PDF después de un breve retraso para permitir que se muestre la alerta
    setTimeout(() => {
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Calcula la altura del contenido y ajusta el tamaño de la página en función de la altura
        const contentHeight =
          canvas.height * (pdf.internal.pageSize.width / canvas.width);
        pdf.internal.pageSize.height = contentHeight;

        // Agrega la imagen al PDF
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          0,
          pdf.internal.pageSize.width,
          contentHeight
        );


        pdf.save(pdfOptions.filename);

        Swal.close();
      });
    }, 100);
  }


}
