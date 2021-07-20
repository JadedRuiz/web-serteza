import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-procedimiento-captura',
  templateUrl: './procedimiento_captura.component.html',
  styleUrls: ['./procedimiento_captura.component.css']
})
export class ProcedimientoCapturaComponent implements OnInit {

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
