import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalogo-periodo',
  templateUrl: './catalogo_periodo.component.html',
  styleUrls: ['./catalogo_periodo.component.css']
})
export class CatalogoPeriodoComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public periodos : any;

  constructor() { }

  ngOnInit(): void {
    this.mostrarPeriodos();
  }

  mostrarPeriodos(){
    this.periodos = [];
  }

  guardar(){

  }

  busqueda(value : any){

  }

  getPeriodo(event : any){

  }

}
