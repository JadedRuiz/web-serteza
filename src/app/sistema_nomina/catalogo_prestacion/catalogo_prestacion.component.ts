import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalogo-prestacion',
  templateUrl: './catalogo_prestacion.component.html',
  styleUrls: ['./catalogo_prestacion.component.css']
})
export class CatalogoPrestacionComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public prestaciones : any;

  constructor() { }

  ngOnInit(): void {
    this.mostrarPrestaciones();
  }

  mostrarPrestaciones(){
    this.prestaciones = [];
  }

  guardar(){

  }

  busqueda(value : any){

  }

  getPrestacion(event : any){

  }
}
