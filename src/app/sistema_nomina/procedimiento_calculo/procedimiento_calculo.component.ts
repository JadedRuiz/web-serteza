import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-procedimiento-calculo',
  templateUrl: './procedimiento_calculo.component.html',
  styleUrls: ['./procedimiento_calculo.component.css']
})
export class ProcedimientoCalculoComponent implements OnInit {
  
  myControl = new FormControl();
  public tipo_incidencia = 1;
  public fecha : any;

  constructor() { }

  ngOnInit(): void {
  }

  busqueda(value : any){

  }
  
  getEmpleado(event : any){

  }
}
