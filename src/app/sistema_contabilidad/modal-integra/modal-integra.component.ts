import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-integra',
  templateUrl: './modal-integra.component.html',
  styleUrls: ['./modal-integra.component.css']
})
export class ModalIntegraComponent implements OnInit {
  trabajadorV: { variables: any[] } = { variables: [] };
  totalImportes: number = 0;
  totalGravadosIMSS: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalIntegraComponent>,
    private calcularService: CalculoService,

    @Inject(MAT_DIALOG_DATA) public trabajador: any

  ) { }

  @ViewChild('Apdf', { static: false })
  Apdf!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.detalleTrabajador();
  }


  cerrarModal(): void {
    this.dialogRef.close();
  }


  detalleTrabajador(){
    let json = {
      id_empresa: this.trabajador.id_empresa,
      rfc: this.trabajador.rfc,
      bimestre: 1 ,
      ejercicio: this.trabajador.ejercicio,
      registro_patronal: this.trabajador.registro_patronal,
      exportar: 0
    }

    this.calcularService.variables(json)
    .subscribe((obj:any)=>{
      if(obj.ok){
        this.trabajadorV.variables = obj.data[0].variables;
        this.calcularTotales();
      }
    })
  }


  calcularTotales() {
    this.totalImportes = this.trabajadorV.variables.reduce((total, variable) => {
      return total + parseFloat(variable.importe);
    }, 0);

    this.totalGravadosIMSS = this.trabajadorV.variables.reduce((total, variable) => {
      return total + parseFloat(variable.gravado_imss);
    }, 0);
  }


 // EXPORTAR PDF
 enPDF = false;
 exportarAPDF() {
this.enPDF = true;

      const content: HTMLElement = this.Apdf.nativeElement;
      const pdf = new jsPDF('landscape', 'mm', 'a4'); // Cambia 'landscape' para orientación horizontal
      const pdfOptions = {
        margin: 10,
        filename: 'variables.pdf',
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
            10,
            0,
            pdf.internal.pageSize.width - 2 * 10,
            contentHeight
          );
            // Elimina la clase CSS que oculta la columna de acciones
            this.enPDF = false;

          pdf.save(pdfOptions.filename);

          Swal.close();
        });
      }, 500);
    }

}
