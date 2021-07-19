import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalogo-registro-patronal',
  templateUrl: './catalogo_registro_patronal.component.html',
  styleUrls: ['./catalogo_registro_patronal.component.css']
})
export class CatalogoRegistroPatronalComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public registros_patronales : any;

  constructor() { }

  ngOnInit(): void {
    this.mostrarRegistrosPatronales();
  }

  mostrarRegistrosPatronales(){
    this.registros_patronales = [];
  }

  guardar(){

  }

  busqueda(value : any){

  }

  getRegistroPatronal(event : any){

  }
}
