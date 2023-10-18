import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { FormControl } from '@angular/forms';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import html2canvas from 'html2canvas';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { Incidencia } from 'src/app/models/Incidencia';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-calcular-incidencias',
  templateUrl: './calcular-incidencias.component.html',
  styleUrls: ['./calcular-incidencias.component.css'],
})
export class CalcularIncidenciasComponent implements OnInit {
  public dateInicio = new FormControl(new Date());
  public dateFinal = new FormControl(new Date());
  public serializedDate = new FormControl(new Date().toISOString());
  public color = COLOR;
  public status = -1; //Status default
  public palabra = '';
  public filterControl = new FormControl();
  public candidatos_busqueda: any;
  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  public filterControlEmpleados = new FormControl();
  public objEmpleados: any;
  public direccion: Direccion = new Direccion(
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );
  public fotografia = new Fotografia(0, '', '', '');
  public id_cliente = parseInt(window.sessionStorage.getItem('cliente') + '');
  public candidato = new Candidato(
    0,
    this.id_cliente,
    6,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    '',
    '',
    '',
    0,
    this.direccion,
    this.fotografia
  );
  public incidencia = new Incidencia (0,0,'','',[],true,0,'','');
  public candidatos: any;
  public ejercicio: any;
  public periodos: any;
  public ejercicioBuscado: any;
  public periodosBuscados: any;
  public resultados: any;
  public totales: any;
  public contador = 0;
  public formattedAmount: any;
  public cliente_seleccionado = window.sessionStorage.getItem('cliente');
  public filterControlEmpresa = new FormControl();
  public empresas: any;
  public empresas_busqueda: any;
  public id_empresa = 0;

  public rfcTrabajador: string = '';
  // TABLA DE EMPLEADO

  public nomSel = '';
  public loading = false;
  // PROCESAR EMPLEADOS
  public empleados: any = [];
  public totalRegistros: number = 0;
  //PARA PAGINADOR
  public empresaNombre: string = '';

  constructor(
    private empresa_service: EmpresaService,
    private candidato_service: CandidatoService,
    private datePipe: DatePipe,
    private pdf: ElementRef
  ) {
    this.tablaParaPDF = pdf;
  }

  @ViewChild('tablaParaPDF', { static: false })
  tablaParaPDF!: ElementRef<HTMLElement>;


  ngOnInit(): void {
    this.cargaPrincipal();
     this.obtenerFecha();

  }


  cargaPrincipal() {
    this.mostrarEmpresas();
  }


  // BUSCAR EMPRESA
  mostrarEmpresas() {
    this.empresas_busqueda = [];
    this.empresas = [];
    this.empresa_service
      .obtenerEmpresasPorIdCliente(this.cliente_seleccionado)
      .subscribe((object: any) => {
        if (object.ok) {
          this.empresas = object.data;
          this.empresas_busqueda = object.data;
        }
      });
  }
  buscarEmpresa() {
    this.empresas_busqueda = [];
    this.empresas.forEach((element: any) => {
      this.empresas_busqueda.push({
        empresa: element.empresa,
        id_empresa: element.id_empresa,
      });
    });
    if (this.filterControlEmpresa.value.length > 0) {
      this.empresas_busqueda = [];
      this.empresas.forEach((element: any) => {
        if (
          element.empresa.includes(
            this.filterControlEmpresa.value.toUpperCase()
          )
        ) {
          this.empresas_busqueda.push({
            empresa: element.empresa,
            id_empresa: element.id_empresa,
          });
        }
      });
    }
  }
  optionEmpresa(value: any) {
    this.id_empresa = value.option.id;
  }

  //PARA EL NOMBRE DE LA EMPRESA SELECIONADA
  nomEmpresa(event: MatAutocompleteSelectedEvent) {
    this.nomSel = event.option.value;
  }

  // PARA EL RFC DEL TRABAJDOR
  onRFCChange() {
    console.log('Nuevo valor de RFC:', this.rfcTrabajador);
  }

  // EXPORTAR PDF
  exportarAPDF() {
    //AGREGA CLASE DE CSS
    const columnasAcciones = document.querySelectorAll('.mat-column-acciones');
    columnasAcciones.forEach((columna) => {
      columna.classList.add('hide-actions-column');
    });

    const content: HTMLElement = this.tablaParaPDF.nativeElement;
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
        // Elimina la clase CSS que oculta la columna de acciones
        columnasAcciones.forEach((columna) => {
          columna.classList.remove('hide-actions-column');
        });

        pdf.save(pdfOptions.filename);

        Swal.close();
      });
    }, 500);
  }

  // BARRA DE BUSQUEDA
  mostrarCandidatos() {
    let json = {
      palabra: this.palabra.toUpperCase(),
      status: this.status,
      id_cliente: this.id_cliente,
      tipo: 1,
    };
    this.candidatos = [];
    this.candidato_service.obtenerCandidatos(json).subscribe((object: any) => {
      if (object.ok) {
        // this.dataSource.data = object.data;
        // this.dataSource.paginator = this.paginator;
        this.candidatos_busqueda = object.data;
        this.objEmpleados = object.data;
      }
    });
  }

  buscarCandidato() {
    this.palabra = this.filterControl.value;
    if (this.filterControl.value.length < 1) {
      this.mostrarCandidatos();
    }
    if (this.filterControl.value.length > 2) {
      this.autocomplete(this.filterControl.value);
    }
  }

  autocomplete(palabra: string) {
    // this.candidatos_busqueda = [];
    if (palabra.length > 2) {
      let json = {
        nombre_candidato: this.palabra.toUpperCase(),
        status: this.status,
        id_cliente: this.id_cliente,
      };
      this.candidato_service
        .autoCompleteCandidato(json)
        .subscribe((object: any) => {
          if (object.ok) {
            this.objEmpleados = object.data;
          }
        });
    }
  }


   // FORMATEAR
   formatearFecha(fecha: any) {
    return formatDate(fecha, 'yyyy-MM-dd', 'en-US');
  }

  //CALCULAR INCIDENCIAS
  calcular() {
   const fechaInicial = this.formatearFecha(this.dateInicio.value);
   const fechaFinal = this.formatearFecha(this.dateFinal.value);


    let json = {
      empresa : this.id_empresa,
      trabajador : this.incidencia.id_empleado,
      fechaInicio:fechaInicial,
      fechaFinal:fechaFinal,
    }
    console.log('json :>> ', json);
    console.log('empresa :>> ', this.id_empresa);



    // Swal.fire({
    //   title: 'Buscando trabajadores',
    //   text: 'Por favor, espere...',
    //   icon: 'info',
    //   allowOutsideClick: false,
    //   showConfirmButton: false,
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    this.loading = true;
  }

  obtenerFecha(){
    const today = new Date();

    // Obtener la fecha del día anterior
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Formatear las fechas como cadenas en el formato deseado
    const todayFormatted = this.datePipe.transform(today, 'yyyy-MM-dd');
    const yesterdayFormatted = this.datePipe.transform(yesterday, 'yyyy-MM-dd');

    // Establecer las fechas iniciales y finales en los FormControl
    this.dateInicio.setValue(yesterdayFormatted);
     this.dateFinal.setValue(todayFormatted);
  }

}
