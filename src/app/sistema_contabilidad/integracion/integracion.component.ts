import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-integracion',
  templateUrl: './integracion.component.html',
  styleUrls: ['./integracion.component.css']
})
export class IntegracionComponent implements OnInit {

    public ejercicio: any;
    public periodos: any;
    public ejercicioBuscado: any;
    public periodosBuscados: any;
    public resultados: any;
    public totales: any;
    public anio = new Date().getFullYear();
    public ejercicioActual = new Date().getFullYear();
    public desMes: any;
    public periodoActual = 0;
    contador = 0;
    formattedAmount: any;
    public cliente_seleccionado = window.sessionStorage.getItem('cliente');
    filterControlEmpresa = new FormControl();
    empresas: any;
    empresas_busqueda: any;
    id_empresa = 0;

    public mesActual: any;
    public biMesActual: any;
    public meses: any[] = [
      {
        Id: 0,
        meses: ['todos'],
      },
      {
        Id: 1,
        meses: ['enero'],
      },
      {
        Id: 2,
        meses: ['febrero'],
      },
      {
        Id: 3,
        meses: ['marzo'],
      },
      {
        Id: 4,
        meses: ['abril'],
      },
      {
        Id: 5,
        meses: ['mayo'],
      },
      {
        Id: 6,
        meses: ['junio'],
      },
      {
        Id: 7,
        meses: ['julio'],
      },
      {
        Id: 8,
        meses: ['agosto'],
      },
      {
        Id: 9,
        meses: ['septembre'],
      },
      {
        Id: 10,
        meses: ['octubre'],
      },
      {
        Id: 11,
        meses: ['nobiembre'],
      },
      {
        Id: 12,
        meses: ['diciembre'],
      },
    ];
    public bimestres: any[] = [
      {
        Id: 0,
        meses: ['todos'],
      },
      {
        Id: 1,
        meses: ['ene-feb'],
      },
      {
        Id: 2,
        meses: ['mar-abr'],
      },
      {
        Id: 3,
        meses: ['may-jun'],
      },
      {
        Id: 4,
        meses: ['jul-ago'],
      },
      {
        Id: 5,
        meses: ['sep-oct'],
      },
      {
        Id: 6,
        meses: ['nov-dic'],
      },
    ];
    public rfcTrabajador: string = '';
    public registroPatronal: string = '';
    // TABLA
    public columnas: string[] = [
      'nombre',
      'imss',
      'rfc',
      'dias_laborados',
      'fecha_ingreso',
      'antiguedad',
      'sueldo_diario',
      'factor',
      'sdi_calculado',
      'variable'

    ];
    public nomSel = '';


    constructor(
      private empresa_service: EmpresaService,
      private calcularService: CalculoService
    ) {}


    @ViewChild('tablaParaPDF', { static: false })
    tablaParaPDF!: ElementRef<HTMLElement>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit(): void {
      this.cargaPrincipal();
    }

    cargaPrincipal() {
      // this.trabajadoreXML();
      this.ejercicios();
      this.mostrarEmpresas();
    }

    //OJO -----------------<=
    exportarAPDF1(){}
    acumulados1(){ }



    // PROCESAR EMPLEADOS
    empleados: any = [];
    loading = false;
    totalRegistros: number = 0;
    //PARA PAGINADOR
    dataSource = new MatTableDataSource<any>();
    empresaNombre: string = '';

    //obtener acumuladod de nomina
    acumulados() {
      console.log('empresa :>> ', this.empresas);

      Swal.fire({
        title: 'Cargando Integrados',
        text: 'Por favor, espere...',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      let json = {
        id_empresa: this.id_empresa,
        rfc: '' || this.rfcTrabajador,
        bimestre: 0 || this.biMesActual,
        ejercicio: this.ejercicioActual,
        registro_patronal: '' || this.registroPatronal,
        exportar: 0
      };

     // console.log(json);
      this.calcularService.exportarExcel(json).subscribe((obj: any) => {
        Swal.close();

        if (obj.ok) {
          this.empleados = obj.data;
          console.log('this.empleados :>> ', this.empleados);
          const numRegistros = obj.data.length;
          const empresaSel = this.nomSel;
          this.dataSource.data = this.empleados;
          //PARA EL TITULO CON NUEMERO DE REGISTROS
          const tituloTabla = document.getElementById('tituloTabla');
          if (tituloTabla) {
            tituloTabla.innerText = `Acumulados de ${empresaSel} (${numRegistros} registros)`;
          }

          // Después de obtener los datos, configura el paginador
          this.paginator.pageSize = 25;
          this.paginator.pageIndex = 0;
          this.paginator.length = this.empleados.length; // Total de registros

          // Asigna el paginador a tu fuente de datos
          this.dataSource.paginator = this.paginator;

          // console.log('json :>> ', json);
          //console.log('obj :>> ', obj);
        } else {
          // Mostrar el mensaje de error al usuario
          Swal.fire({
            icon: 'error',
            title: 'Error al buscar trabajadores',
            text: 'Hubo un problema al buscar los trabajadores. Inténtalo de nuevo más tarde.',
          });
        }
      });
      this.loading = true;
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

    // PARA SELECCIONAR MES
    mesSeleccionado(MesSel: any) {
      this.mesActual = MesSel;
    }

    // PARA SELECIONAR BIMESTRE
    bimesSeleccionado(BimesSel: any) {
      this.biMesActual = BimesSel;
    }

    // PARA SELECIONAR PERIODO
    onPeriodChange() {
      console.log('Nuevo valor de periodo:', this.periodoActual);
    }

    // PARA SELECIONAR AÑO
    ejercicios() {
      this.ejercicio = [];
      this.contador = 1;
      for (let i = this.anio - 5; i <= this.anio; i++) {
        this.ejercicio.push({
          id: this.contador,
          ejercicio: i,
        });
        this.contador = this.contador + 1;
      }
      // this.ejercicioActual = this.contador - 1;
      this.ejercicioBuscado = this.ejercicio;
    }
    ejercicioSeleccionado(EjercicioSel: any) {
      console.log(EjercicioSel.value);
      this.ejercicioActual = EjercicioSel.value;
    }

    // PARA EL RFC DEL TRABAJDOR
    onRFCChange() {
      console.log('Nuevo valor de RFC:', this.rfcTrabajador);
    }


//Exportar Variables
exportarVariables(){
    let json = {
      id_empresa: this.id_empresa,
        rfc: '' || this.rfcTrabajador,
        bimestre: 0 || this.biMesActual,
        ejercicio: this.ejercicioActual,
        registro_patronal: '' || this.registroPatronal,
        exportar: 1
    };

  this.calcularService.variables(json).subscribe((object:any)=>{
    if(object.ok){
      Swal.fire({
        title: 'Generando variables',
        text: 'Por favor, espere...',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
      setTimeout( ()=> {
    var arrayBuffer = this.base64ToArrayBuffer(object.data);
      var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
      var data = window.URL.createObjectURL(newBlob);
      let link  = document.createElement('a');
      link.href = data;
      link.download = "ReporteVariables.xlsx";
      link.click();
      Swal.close();
      },500)



    }
  })

}


// EXPORTAR EXCEL
exportExel(){
    let json = {
      id_empresa: this.id_empresa,
        rfc: '' || this.rfcTrabajador,
        bimestre: 0 || this.biMesActual,
        ejercicio: this.ejercicioActual,
        registro_patronal: '' || this.registroPatronal,
        exportar: 1
    };

  this.calcularService.exportarExcel(json).subscribe((object:any)=>{
    if(object.ok){
      Swal.fire({
        title: 'Generando reporte',
        text: 'Por favor, espere...',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
      setTimeout( ()=> {
    var arrayBuffer = this.base64ToArrayBuffer(object.data);
      var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
      var data = window.URL.createObjectURL(newBlob);
      let link  = document.createElement('a');
      link.href = data;
      link.download = "ReporteIntegrado.xlsx";
      link.click();
      Swal.close();
      },500)



    }
  })
  }


  base64ToArrayBuffer(base64 : string) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }


    // EXPORTAR PDF

    // ocultar paginaodr
    paginador = true
    exportarAPDF() {
      this.paginador = false;
      const content: HTMLElement = this.tablaParaPDF.nativeElement;
      const pdf = new jsPDF('landscape', 'mm', 'a4'); // Cambia 'landscape' para orientación horizontal
      const pdfOptions = {
        margin: 10,
        filename: 'acumuladosNomina.pdf',
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
          this.paginador = true;
        });
      }, 100);
    }
  }
