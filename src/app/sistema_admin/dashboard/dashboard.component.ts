import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public color = COLOR;
  public id_empresa = window.sessionStorage.getItem("empresa");
  public targeta = [0,0,0,0];
  public puestos : any;
  public movimientos : any;
  public band_mov = false;
  constructor(
    private dashboard_sv : DashboardService
  ) { }

  ngOnInit(): void {
    this.mostrarDashboard();
  }
  
  mostrarDashboard(){
    this.puestos = [];
    this.movimientos = [];
    this.dashboard_sv.obtenerDashboardAdmin(this.id_empresa)
    .subscribe ( (object : any) => {
      if(object.ok){
        this.targeta = [object.data.targetas.activos,object.data.targetas.autorizados,object.data.targetas.vacantes,object.data.targetas.por_procesar];
        this.puestos = object.data.tabla_puesto;
        if(object.data.tabla_mov.length > 0){
          this.band_mov = true;
          this.movimientos = object.data.tabla_mov;
        }else{
          this.band_mov = false;
        }
      }else{
        this.targeta = [0,0,0,0];
      }
    });
  }
}
