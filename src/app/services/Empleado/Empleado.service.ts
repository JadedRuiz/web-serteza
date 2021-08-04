import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Empleado } from 'src/app/models/Empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerNombreNominaPorId(id : any){
    let url = SERVER_API+"nomina/obtenerNombreNominaPorId/"+id;
    return this.http.get(url);
  }
  
  obtenerEmpleadoPorId(id : any){
    let url = SERVER_API+"empleado/obtenerEmpleadoPorId/"+id;
    return this.http.get(url);
  }

  obtenerCandidatoPorEmpresa(json : any){
    let url = SERVER_API+"empleado/obtenerCandidatoPorEmpresa";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  obtenerEmpleadosPorEmpresa(json : any){
    let url = SERVER_API+"empleado/obtenerEmpleadosPorEmpresa";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  autocompleteEmpleado(json : any){
    let url = SERVER_API+"empleado/autocompleteEmpleado";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  obtenerEmpleadoPorTipoNomina(json : any){
    let url = SERVER_API+"empleado/obtenerEmpleadoPorTipoNomina";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  crearNuevoEmpleadoConCandidatoExistente(empleado : Empleado){
    let url = SERVER_API+"empleado/crearNuevoEmpleadoConCandidatoExistente";
    return this.http.post( url, empleado )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  crearNuevoEmpleado(empleado : Empleado){
    let url = SERVER_API+"empleado/crearNuevoEmpleado";
    return this.http.post( url, empleado )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  eliminarLigaEmpresaNomina(id : any){
    let url = SERVER_API+"nomina/eliminarLigaEmpresaNomina/"+id;
    return this.http.get(url);
  }

  activarLigaEmpresaNomina(id : any){
    let url = SERVER_API+"nomina/activarLigaEmpresaNomina/"+id;
    return this.http.get(url);
  }
}