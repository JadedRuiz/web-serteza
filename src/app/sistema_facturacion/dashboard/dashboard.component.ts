import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';
import { COLOR } from 'src/config/config';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public color = COLOR;
  public id_cliente = window.sessionStorage.getItem("cliente");
  public anio = new Date().getFullYear();
  public anios : any;
  public empresas : any;
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

  constructor(
    private dashboard_sv : DashboardService,
    private empresa_service: EmpresaService
    ) { }

  ngOnInit(): void {
    this.mostrarDashboard();
    this.pintarAnios();
  }

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

  pintarChart(id_empresa : any){
    let json = {
      id_empresa : id_empresa,
      anio : this.anio
    };
    let facturas : any;
    let pagadas : any;
    let por_pagar : any;
    this.empresas.forEach((element : any) => {
      if(element.id_empresa == id_empresa){
        this.doughnutChartData = [
          { data: [ element.facturas, 0, 0 ] },
          { data: [ 0, element.pagadas, element.por_pagar ] }
        ];
      }
    });
    facturas = [];
    pagadas = [];
    por_pagar = [];
    this.dashboard_sv.obtenerDatosEmpresaFacturacion(json)
    .subscribe((object : any) => {
      if(object.ok){
        object.data.forEach((element : any) => {
          facturas.push(element.facturas);
          pagadas.push(element.pagadas);
          por_pagar.push(element.por_pagar);
        });
        this.barChartData = [ 
          { data : facturas, label : "Facturas"},
          { data : pagadas, label : "Pagadas"},
          { data : por_pagar, label : "Por pagar"}
        ];
      }
    });
    
  }
}
