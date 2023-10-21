import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { FormControl } from '@angular/forms';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import Swal from 'sweetalert2';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';
import { CacheTrabService } from 'src/app/services/cache/cache-trab.service';
import { jsPDF } from 'jspdf';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import html2canvas from 'html2canvas';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
@Component({
  selector: 'app-reporte-incidencias',
  templateUrl: './reporte-incidencias.component.html',
  styleUrls: ['./reporte-incidencias.component.css']
})
export class ReporteIncidenciasComponent implements OnInit {


    dateInicio = new FormControl(new Date());
    dateFinal = new FormControl(new Date());
    serializedDate = new FormControl((new Date()).toISOString());
    public color = COLOR;
    public status = -1; //Status default
    public palabra = "";
    filterControl = new FormControl();
    candidatos_busqueda : any;
      public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
      filterControlEmpleados = new FormControl();
      objEmpleados: any;
    public direccion : Direccion = new Direccion(0,"","","","","","","","","","","");
    public fotografia = new Fotografia(0,"","","");
    public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
    public candidato = new Candidato(0,this.id_cliente,6,"","","","","","","","",0,"","","","","",0,this.direccion,this.fotografia);
    public candidatos : any;
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
       // TABLA DE EMPLEADO
       public columnas: string[] = [
        'num_empleado',
        'nombre',
        'rfc',
        'periodo',
        'fecha_inicial_pago',
        'fecha_final_pago',
        'uuid',
        'acciones', // Agrega esto si necesitas columnas de acciones
      ];
     public nomSel =''
     loading = false;
       // PROCESAR EMPLEADOS
       empleados: any = [];
       totalRegistros: number = 0;
        //PARA PAGINADOR
       dataSource = new MatTableDataSource<any>();
       empresaNombre: string = '';


      constructor(
        private empresa_service: EmpresaService,
        private calcularService: CalculoService,
        private cacheService: CacheTrabService,
      private candidato_service: CandidatoService,

        private pdf: ElementRef
      ) {
        this.tablaParaPDF = pdf;
      }

      @ViewChild('tablaParaPDF', { static: false })
      tablaParaPDF!: ElementRef<HTMLElement>;

      @ViewChild(MatPaginator) paginator!: MatPaginator;

      ngOnInit(): void {
        this.cargaPrincipal();

        const cachedData = this.cacheService.getData();
        console.log('this.cahcheData :>> ', cachedData);
      if (cachedData) {
        this.loading = true;

        // this.empleados = cachedData;
        // Configura el paginador y la tabla
        // this.dataSource.data = cachedData;
        // Después de obtener los datos, configura el paginador
        this.paginator.pageSize = 10;
        this.paginator.pageIndex = 0;
        this.paginator.length = this.empleados.length; // Total de registros

        // Asigna el paginador a tu fuente de datos
        this.dataSource.paginator = this.paginator;
      }
      }


      cargaCache(){

      }


      cargaPrincipal() {
        // this.trabajadoreXML();
        this.ejercicios();
        this.mostrarEmpresas();
      }




      //EMPEADOS XML
      trabajadoresXML() {
      console.log('empresa :>> ', this.empresas);

        Swal.fire({
          title: 'Buscando trabajadores',
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
          mes: 0 || this.mesActual,
          bimestre: 0 || this.biMesActual,
          periodo: 0 || this.periodoActual,
          ejercicio: this.ejercicioActual,
        };
        this.calcularService.obtenerXml(json)
        .subscribe((obj: any) => {
          Swal.close();

          if (obj.ok) {
            this.empleados = obj.data;
            const numRegistros = obj.data.length;
            const empresaSel = this.nomSel;

            this.dataSource.data = this.empleados;
            // Después de obtener los datos, configura el paginador
            this.paginator.pageSize = 10;
            this.paginator.pageIndex = 0;
            this.paginator.length = this.empleados.length; // Total de registros

            // Asigna el paginador a tu fuente de datos
            this.dataSource.paginator = this.paginator;

            //Guardando en Cache
            this.cacheService.saveData(this.empleados);

            //PARA EL TITULO CON NUEMERO DE REGISTROS
            const tituloTabla = document.getElementById('tituloTabla');
            if (tituloTabla) {
              tituloTabla.innerText = `Trabajadores de ${empresaSel} (${numRegistros} registros)`;
            }
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
      mostrarCandidatos(){
        let json = {
          palabra : this.palabra.toUpperCase(),
          status : this.status,
          id_cliente : this.id_cliente,
          tipo : 1
        };
        this.candidatos = [];
        this.candidato_service.obtenerCandidatos(json)
        .subscribe( (object : any) =>{
            if(object.ok){
              // this.dataSource.data = object.data;
              // this.dataSource.paginator = this.paginator;
             this.candidatos_busqueda= object.data;
             this.objEmpleados = object.data
            }
        });
      }



      buscarCandidato(){
        this.palabra = this.filterControl.value;
        if(this.filterControl.value.length < 1){
          this.mostrarCandidatos();
        }
        if(this.filterControl.value.length > 2){
          this.autocomplete(this.filterControl.value);
        }
      }



      autocomplete(palabra : string){
       // this.candidatos_busqueda = [];
        if(palabra.length > 2){
          let json = {
            nombre_candidato : this.palabra.toUpperCase(),
            status : this.status,
            id_cliente : this.id_cliente
          };
          this.candidato_service.autoCompleteCandidato(json)
          .subscribe((object : any) => {
            if(object.ok){
              this.objEmpleados = object.data;
               this.dataSource.data = object.data;
              // n this.dataSource.paginator = this.paginator;
            }
          })
        }
      }


}