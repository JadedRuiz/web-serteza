import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalogo-cuenta-bancaria',
  templateUrl: './catalogo_cuenta_bancaria.component.html',
  styleUrls: ['./catalogo_cuenta_bancaria.component.css']
})
export class CatalogoCuentaBancariaComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public cuentas_bancarias : any;

  constructor() { }

  ngOnInit(): void {
    this.mostrarCuentasBancarias();
  }

  mostrarCuentasBancarias(){
    this.cuentas_bancarias = [];
  }

  guardar(){

  }

  busqueda(value : any){

  }

  getCuentaBancaria(event : any){

  }

}
