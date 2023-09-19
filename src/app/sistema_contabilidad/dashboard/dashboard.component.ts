import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { COLOR } from 'src/config/config';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  myControl = new FormControl();
  contador = 0;
  filterControlEmpresa = new FormControl();
  public ejercicio: any;
  public ejercicioBuscado: any;
  public anio = new Date().getFullYear();
  public ejercicioActual = new Date().getFullYear();
  public periodoActual = 0;
  public empresas: any;
  public nomSel = '';
  public cliente_seleccionado = window.sessionStorage.getItem('cliente');
  public empresas_busqueda: any;
  public id_empresa = 0;

  constructor(
    private empresa_service: EmpresaService,
    private dashboard_sv : DashboardService,

    ) {}
    graficas=false;
  ngOnInit(): void {
    this.ejercicios();
    this.mostrarEmpresas();
    this.pintarAnios();
  }

  // EJERCICIOS
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
    this.graficas=true;
    this.mostrarDashboard();


  }
  buscarEjercicio() {
    this.ejercicio = [];
    this.ejercicioBuscado.forEach((element: any) => {
      this.ejercicio.push({
        id: element.id,
        ejercicio: element.ejercicio,
      });
    });
    if (this.myControl.value.length > 0) {
      this.ejercicio = [];
      this.ejercicioBuscado.forEach((element: any) => {
        if (element.ejercicio.includes(this.myControl.value.toUpperCase())) {
          this.ejercicio.push({
            id: element.id,
            ejercicio: element.ejercicio,
          });
        }
      });
    }
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


  // --------------------------------
  // =>GRAFICAS
  public color = COLOR;
  public id_cliente = window.sessionStorage.getItem("cliente");
  public anios : any;
  public targeta = [0,0,0,0];
  public barChartData : ChartDataSets[] = [];
  public barChartLabels: Label[] = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Nov","Dic"];
  public barChartOptions = { responsive : true };
  public chartColors : Color[] = [
    {
      borderColor : 'black',
      backgroundColor : 'rgb(176,196,222,.5)'
    }
  ];
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartType = "line";

  public doughnutChartLabels: Label[] = [ 'Facturas', 'Pagadas', 'Por pagar' ];
  public doughnutChartData: ChartDataSets[] = [];

  mostrarDashboard(){
    let json = {
      id_cliente : this.id_cliente,
      anio : this.anio
    };
    this.dashboard_sv.obtenerDasboardFacturacion(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.targeta = [object.data.empresas_t,object.data.total,object.data.pagadas_t,object.data.por_pagar_t];
        this.empresas = object.data.empresas;
        this.pintarChart(object.data.empresas[0].id_empresa);
      }
    });
  }

  pintarAnios(){
    this.anios = [];
    for(let i=(this.anio-10);i<=this.anio;i++){
      this.anios.push(i);
    }
  }

  pintarChart(id_empresa : any = 121){
    let json = {
      id_empresa : id_empresa,
      anio : this.anio
    };
    let facturas : any ;
    let pagadas : any ;
    let por_pagar : any ;
    this.empresas.forEach((element : any) => {
      if(element.id_empresa == id_empresa){
        this.doughnutChartData = [
          { data: [ element.facturas, 30, 20 ] },
          { data: [ 10, element.pagadas, element.por_pagar ] }
        ];
      }
    });
    facturas = [30, 40, 25, 50, 35, 20, 45, 60, 70, 55, 45, 30];
    pagadas = [15, 25, 20, 30, 10, 30, 25, 40, 50, 35, 40, 20];
    por_pagar = [15, 15, 5, 20, 25, 10, 20, 20, 20, 20, 5, 10];
    this.dashboard_sv.obtenerDatosEmpresaFacturacion(json)
    .subscribe((object : any) => {
      if(object.ok){
        object.data.forEach((element : any) => {
          facturas.push(element.facturas);
          pagadas.push(element.pagadas);
          por_pagar.push(element.por_pagar);
        });
        this.barChartData = [
          { data : facturas, label : "dato 1"},
          { data : pagadas, label : "dato 2"},
          { data : por_pagar, label : "dato 3"}
        ];
      }
    });

  }




}
