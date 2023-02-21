import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';
import { COLOR } from 'src/config/config';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public color = COLOR;
  public id_cliente = window.sessionStorage.getItem("cliente");
  public targeta = [0,0,0,0];
  public puestos : any;
  public movimientos : any;
  public band_mov = false;
  public barChartData : ChartDataSets[] = [
    { data : [30,8,1,6,24], label : "sep-18"},
    { data : [29,8,1,6,18], label : "oct-18"},
    { data : [30,9,1,6,18], label : "nov-18"},
    { data : [27,8,1,5,19], label : "dic-18"},
    { data : [27,8,1,6,24], label : "ene-18"},
    { data : [27,9,1,6,22], label : "feb-18"},
    { data : [36,8,1,7,25], label : "mar-18"},
  ];
  public barChartLabels: Label[] = ["Comercial","Granjas","Oficinas generales","Plantas procesadoras","Terceros"];
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
  public barChartDataDos : ChartDataSets[] = [
    { data : [2725671.18,1319470.01,352167.48,1865538.38,1145832.47,50000.00,1829405.60,307735.70], label : "Bajo"},
    { data : [0,0,0,676019.10,3621426.02,5370332.25,6241976.07,2900004.00], label : "Medio"},
    { data : [0,0,0,81657.68,742645.76,452909.90,1655753.81,0], label : "Alto"},
    { data : [2725671.18,1319470.01,352167.48,3357815.16,5509904.25,1039942.15,9727135.48,320779.70], label : "Total general"},
  ];
  public barChartLabelsDos: Label[] = ["2010","2012","2013","2015","2016","2017","2018","2019"];


  constructor(
    private dashboard_sv : DashboardService) { }

  ngOnInit(): void {
    // this.mostrarDashboard();
  }

  // mostrarDashboard(){
  //   this.puestos = [];
  //   this.movimientos = [];
  //   this.dashboard_sv.obtenerDashboardRh(this.id_cliente)
  //   .subscribe ( (object : any) => {
  //     if(object.ok){
  //       this.targeta = [object.data.targetas.activos,object.data.targetas.autorizados,object.data.targetas.vacantes,object.data.targetas.por_procesar];
  //       this.puestos = object.data.tabla_puesto;
  //       if(object.data.tabla_mov.length > 0){
  //         this.band_mov = true;
  //       }else{
  //         this.band_mov = false;
  //       }
  //       this.movimientos = object.data.tabla_mov;
  //     }else{
  //       this.targeta = [0,0,0,0];
  //     }
  //   });
  // }

}
