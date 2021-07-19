import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalogo-sucursal',
  templateUrl: './catalogo_sucursal.component.html',
  styleUrls: ['./catalogo_sucursal.component.css']
})
export class CatalogoSucursalComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public sucursales : any;

  constructor() { }

  ngOnInit(): void {
    this.mostrarSucursales();
  }

  mostrarSucursales(){
    this.sucursales = [];
  }

  guardar(){

  }

  busqueda(value : any){

  }

  getSucursal(event : any){

  }

}
