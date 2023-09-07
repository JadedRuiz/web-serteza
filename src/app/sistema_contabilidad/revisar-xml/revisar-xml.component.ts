import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';

@Component({
  selector: 'app-revisar-xml',
  templateUrl: './revisar-xml.component.html',
  styleUrls: ['./revisar-xml.component.css'],
})
export class RevisarXmlComponent implements OnInit {
  public ejercicio: any;
  public periodos: any;
  public ejercicioBuscado: any;
  public mesesBuscado: any;
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

  constructor(
    private dashboard_sv: DashboardService,
    private nomina_service: NominaService,
    private contabilidad_service: ContabilidadService,
    private currencyPipe: CurrencyPipe,
    private empresa_service: EmpresaService,
    private calcularService: CalculoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargaPrincipal();
  }
  cargaPrincipal() {
    // this.trabajadoreXML();
    this.ejercicios();
    this.mostrarEmpresas();
  }


  // PROCESAR EMPLEADOS
  empleados: any = [];
  loading = false;
  totalRegistros: number = 0;

  // TABLA DE EMPLEADO
  columnas: string[] = [
    'num_empleado',
    'nombre',
    'rfc',
    'periodo',
    'fecha_inicial_pago',
    'fecha_final_pago',
    'uuid',
    'acciones', // Agrega esto si necesitas columnas de acciones
  ];

  //EMPEADOS XML
  trabajadoresXML() {
    let json = {
      id_empresa: this.id_empresa,
      rfc: '' || this.rfcTrabajador,
      mes: 0 || this.mesActual,
      bimestre: 0 || this.biMesActual,
      periodo: 0 || this.periodoActual,
      ejercicio: this.ejercicioActual,
    };
    this.calcularService.obtenerXml(json).subscribe((obj: any) => {
      if (obj.ok) {
        this.empleados = obj.data;
        console.log('json :>> ', json);
        console.log('obj :>> ', obj);
        this.loading = true;
      }else {
        // Mostrar el mensaje de error al usuario
      }
    });
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
}
