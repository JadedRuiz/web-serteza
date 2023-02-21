import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { Alert } from 'selenium-webdriver';

import { ChartDataSets } from 'chart.js';
import { COLOR } from 'src/config/config';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { Label, Color } from 'ng2-charts';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';


@Component({  
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  myControl= new FormControl();
  public color = COLOR;
  // public id_cliente = window.sessionStorage.getItem("cliente");

  public ejercicio : any;
  public meses : any;
  public periodos : any;
  public ejercicioBuscado : any;
  public mesesBuscado : any;
  public periodosBuscados : any;
  public resultados: any;
  public totales: any;
  public anio = new Date().getFullYear();
  public ejercicioActual   = new Date().getFullYear();
  public mesActual = new Date().getMonth();
  public desMes : any;
  public periodoActual = 0;

  Suma_neto_fiscal = 0;
  Suma_neto_exento = 0;
  Suma_costo_social = 0;
  Suma_impuesto_estatal = 0;
  Suma_comision = 0;
  contador = 0;
  // public mesActual :any;
  public empresas : any;
 
  constructor(
    private dashboard_sv : DashboardService,
    private empresa_service: EmpresaService,
    private nomina_service: NominaService
  ) { }

  ngOnInit(): void {
    this.ejercicios()
    this.Meses()
    this.mostrarDashboard();
    this.buscarInformacion();
  }

  ejercicios(){
    this.ejercicio = [];
    this.contador = 1;
    for(let i=(this.anio-5);i<=this.anio;i++){
      this.ejercicio.push({
        "id" : this.contador,
        "ejercicio" : i
      });
      this.contador = this.contador + 1;
    }
    // this.ejercicioActual = this.contador - 1;
    this.ejercicioBuscado = this.ejercicio;
  }

  Meses(){
    
    this.dashboard_sv.obtenerMeses()
    .subscribe((object : any) => {
      if(object.ok){
        this.meses = object.data;
        this.mesesBuscado = object.data;
        this.desMes = this.meses[this.mesActual+1].mes;
        this.meses[this.mesActual+1].id = this.mesActual+1;
        this.periodosMensual()
      }
    });
  }

  periodosMensual(){
    let json = {
      id_empresa : 78,
      ejercicio : this.ejercicioActual,
      mes : this.mesActual
    };
    
    this.nomina_service.periodosPorMes(json)
    .subscribe((object : any) => {
      if(object.ok){
        
        this.periodos = object.data;
        
      }
    });
  }

  buscarInformacion(){
    let json = {
      id_empresa : 78,
      ejercicio : this.ejercicioActual,
      mes : this.mesActual,
      id_periodo: this.periodoActual
    };
    
    this.dashboard_sv.obtenerCostosNomina(json)
    .subscribe((object : any) => {
      if(object.ok){
        
        this.resultados = object.data;
        this.totales = object.totales;

        this.Suma_neto_fiscal = this.totales["neto_fiscal"];
        this.Suma_neto_exento = this.totales["neto_exento"];
        this.Suma_costo_social = this.totales["costo_social"];
        this.Suma_impuesto_estatal = this.totales["impuesto_estatal"];
        this.Suma_comision = this.totales["comision"];

        // for (let elemento of this.resultados) { 
        //   this.Suma_neto_fiscal = this.Suma_neto_fiscal + elemento["neto_fiscal"];
        //   this.Suma_neto_exento = this.Suma_neto_exento + elemento["neto_exento"];
        //   this.Suma_costo_social = this.Suma_costo_social + elemento["costo_social"];
        //   this.Suma_impuesto_estatal = this.Suma_impuesto_estatal + elemento["impuesto_estatal"];
        //   this.Suma_comision = this.Suma_comision + elemento["comision"];
        //  }
        
      }
    });
  }
  mesSeleccionado(MesSel:any){
    
  this.mesActual = MesSel;
  this.periodosMensual();
  this.buscarInformacion();
   
  }

  ejercicioSeleccionado(EjercicioSel:any){
    console.log(EjercicioSel.value);
     this.ejercicioActual = EjercicioSel.value;
     this.buscarInformacion();
   
  }

  periodoSeleccionado(PeriodoSel:any){
     this.periodoActual = PeriodoSel;
     this.buscarInformacion();
  }

  mostrarDashboard(){
    let json = {
      id_cliente : 0,
      anio : this.anio
    };
    this.dashboard_sv.obtenerDasboardFacturacion(json)
    .subscribe((object : any) => {
      if(object.ok){
        
        this.empresas = object.data.empresas;
        // this.pintarChart(object.data.empresas[0].id_empresa);
      }
    });
  }

  limpiar(){

  }
  desplegarInformacion(){

    // alert(this.periodos.id);
    this.periodosMensual();
    this.buscarInformacion();
    // alert("LLEGO"+this.meses.id);
  }

  buscarEjercicio(){
    this.ejercicio = [];
    this.ejercicioBuscado.forEach((element : any) => {
      this.ejercicio.push({
        "id" : element.id,
        "ejercicio" : element.ejercicio
      });
    });
    if(this.myControl.value.length > 0){
      this.ejercicio = [];
      this.ejercicioBuscado.forEach((element : any) => {
        if(element.ejercicio.includes(this.myControl.value.toUpperCase())){ 
          this.ejercicio.push({
            "id" : element.id,
            "ejercicio" : element.ejercicio
          });
        }
      });
    }
  }

  

}
