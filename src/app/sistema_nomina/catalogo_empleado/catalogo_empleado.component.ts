import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';

@Component({
  selector: 'app-catalogo-empleado',
  templateUrl: './catalogo_empleado.component.html',
  styleUrls: ['./catalogo_empleado.component.css']
})
export class CatalogoEmpleadoComponent implements OnInit {

  myControl = new FormControl();
  public status = -1;
  public direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public candidato = new Candidato(0,0,6,"","","","","","","","",0,"","","","","",this.usuario_logueado,this.direccion,this.fotografia);
  public colonias : any;
  constructor() { }

  ngOnInit(): void {
  }

  mostrarEmpleados(){

  }

  getEmpleado(event : any){

  }
  busqueda(event : any){

  }
  generarEdad(){

  }
  modificarMunicipio(){

  }
  getDatos(){
    
  }
}
