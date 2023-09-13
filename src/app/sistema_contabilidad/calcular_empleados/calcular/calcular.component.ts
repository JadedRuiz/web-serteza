import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';
import { FacturacionService } from 'src/app/services/Facturacion/Facturacion.service';

@Component({
  selector: 'app-calcular',
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.css'],
})
export class CalcularComponent implements OnInit {

  public ejercicio: any;
  public periodos: any;
  public ejercicioBuscado: any;
  public mesesBuscado: any;
  public periodosBuscados: any;
  public resultados: any;
  public totales: any;
  public anio = new Date().getFullYear();
  public ejercicioActual = new Date().getFullYear();
  public mesActual = new Date().getMonth();
  public desMes: any;
  public periodoActual = 0;
  contador = 0;
  formattedAmount: any;
  public cliente_seleccionado = window.sessionStorage.getItem('cliente');
  filterControlEmpresa = new FormControl();
  empresas: any;
  empresas_busqueda: any;
  id_empresa = 0;
  public bimestres: any[] = [
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

  constructor(
    private nomina_service: NominaService,
    private empresa_service: EmpresaService,
    private calcularService: CalculoService,
    private factura_service : FacturacionService,

    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargaPrincipal();
  }
  cargaPrincipal() {
    this.ejercicios();
    this.mostrarEmpresas();
  }







 // PROCESAR EMPLEADOS
 empleados: any = [];
 loading = false;
 totalRegistros: number = 0;
 progreso: number = 0;
 registrosProcesados = 0;
 empleadoProcesado = {
   rfc: '',
   nombre: '',
 };
 regPatronal: string = '';
 rfcTrab: string = '';




  // CONSULTAR EMPLEADOS
  traerEmpleados() {
    let json = {
      id_empresa: this.id_empresa,
      bimestre: this.mesActual,
      ejercicio: this.ejercicioActual,
    };
    this.calcularService.obtenerEmpleados(json).subscribe((obj: any) => {
      if (obj.ok) {
        this.empleados = obj.data;
        this.totalRegistros = this.empleados.length;
        //console.log('algo seguramente:>> ', obj);

        this.procesar();
        //console.log('json :>> ', json);
        Swal.fire({
          icon: 'success',
          title: 'Trabajadores obtenidos',
        })
      } else {
        Swal.fire('ha ocurrido un error');
      }
    });

  }

  procesar() {
    this.loading = true; // Activar la barra de carga
    this.progreso = 0; // Inicializa el progreso
    this.registrosProcesados = 0; // Inicializa la cantidad de registros procesados


    // Crear un arreglo de Promesas para los cálculos
    const promesas = this.empleados.map((empleado: any) => {


      return this.calcular(empleado.rfc).then(() => {
        this.empleadoProcesado = {
          rfc: empleado.rfc,
          nombre: empleado.nombre,
        };
          // Incrementa el número de registros procesados
          this.registrosProcesados++;
          // Calcula el progreso en función de los registros procesados
          this.progreso =
            (this.registrosProcesados / this.empleados.length) * 100;
          // Detecta cambios en el componente para actualizar la vista
          this.cdr.detectChanges();
      });

    });

    // Usar Promise.all para esperar a que todas las Promesas se resuelvan
    return Promise.all(promesas)
      .then(() => {
        this.loading = false; // Desactivar la barra de carga

        // Mostrar notificación de proceso completado
        Swal.fire({
          title: 'Proceso completado',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un error',
        });
      });
  }

  calcular(rfc: string): Promise<void> {
    let json = {
      id_empresa: this.id_empresa,
      rfc: rfc,
      bimestre: this.mesActual,
      ejercicio: this.ejercicioActual,
    };

    // Devolver la Promesa resultante de la llamada HTTP
    return new Promise<void>((resolve, reject) => {
      this.calcularService.calculoIntegrado(json).subscribe(
        (resp) => {
          console.log(resp.message, json);
            resolve(); // Resuelve la promesa cuando la llamada HTTP es exitosa

        },
        (error) => {
          reject(error); // Rechaza la promesa en caso de error
        }
      );
    });
  }




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


  mesSeleccionado(MesSel: any) {
    this.mesActual = MesSel;
  }
  ejercicioSeleccionado(EjercicioSel: any) {
    console.log(EjercicioSel.value);
    this.ejercicioActual = EjercicioSel.value;
  }


  // EXPORTAR EXCEL
exportExel(){
  const  rfcTrabajador = this.rfcTrab;
  const regPatronal = this.regPatronal;
    let json = {
      id_empresa: this.id_empresa,
      bimestre: this.mesActual,
      ejercicio: this.ejercicioActual,
      rfc : rfcTrabajador,
      registro_patronal: regPatronal
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
      link.download = "ReporteCalculado.xlsx";
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

}
