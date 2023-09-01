import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private dashboard_sv: DashboardService,
    private nomina_service: NominaService,
    private contabilidad_service: ContabilidadService,
    private currencyPipe: CurrencyPipe,
    private empresa_service: EmpresaService,
    private calcularService: CalculoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargaPrincipal();
  }
  cargaPrincipal() {
    this.ejercicios();
    this.mostrarEmpresas();
  }

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
        Swal.fire('Registros obtenidos');
        console.log('obj :>> ', obj);
        this.procesar()
        console.log('json :>> ', json);
      } else {
      }
    });
  }

  // PROCESAR EMPLEADOS
  empleados: any = [];
  loading = false;
  procesar() {
    this.loading = true;

    this.empleados.forEach((empleado: any) => {
      this.calcular(empleado.rfc);
    })

    console.log("hola");
    // Mostrar notificación de proceso completado
    this.snackBar.open('Proceso completado', 'Cerrar', {
      duration: 3000, // Duración de la notificación en milisegundos
    });
  }

  // CALCULO INTEGRADo
  calcular(rfc: string) {
    let json = {
      id_empresa: this.id_empresa,
      rfc: rfc,
      bimestre: this.mesActual,
      ejercicio: this.ejercicioActual,
    };
    this.calcularService.calculoIntegrado(json).subscribe((obj: any) => {
      if (obj.ok) {
        console.log('Calculo :>> ', obj);
        console.log(this.loading);
      } else {
      }
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

  periodosMensual() {
    let json = {
      id_empresa: 78,
      ejercicio: this.ejercicioActual,
      mes: this.mesActual,
    };

    this.nomina_service.periodosPorMes(json).subscribe((object: any) => {
      if (object.ok) {
        this.periodos = object.data;
      }
    });
  }

  mesSeleccionado(MesSel: any) {
    this.mesActual = MesSel;
    this.periodosMensual();
  }
  ejercicioSeleccionado(EjercicioSel: any) {
    console.log(EjercicioSel.value);
    this.ejercicioActual = EjercicioSel.value;
  }
  periodoSeleccionado(PeriodoSel: any) {
    this.periodoActual = PeriodoSel;
  }
}
