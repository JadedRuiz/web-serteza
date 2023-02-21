import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Departamento } from 'src/app/models/Departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerDepartamentos(json : any){
      let url = SERVER_API + "departamento/obtenerDepartamentos";
      return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  altaDepartamento(departamento : Departamento){
    let url = SERVER_API+"departamento/altaDepartamento";
    return this.http.post( url, departamento )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  
  actualizarDepartamento(departamento : Departamento){
    let url = SERVER_API+"departamento/actualizarDepartamento";
    return this.http.post( url, departamento )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  
  obtenerDepartamentoPorId(id : any){
    let url = SERVER_API+"departamento/obtenerDepartamentoPorId/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  autoCompleteDepartamento(json : any){
    let url = SERVER_API+"departamento/autoCompleteDepartamento";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

}
