import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Contrato } from 'src/app/models/Contrato';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerMoviemientosContratacion(json : any){
      let url = SERVER_API + "contratacion/obtenerMoviemientosContratacion";
      return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  altaMovContratacion(json : any){
    let url = SERVER_API+"contratacion/altaMovContratacion";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.data, 'error');
      return throwError(err);
    }));
  }
  
  editarMovContrato(json : any){
    let url = SERVER_API+"contratacion/editarMovContrato";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.data, 'error');
      return throwError(err);
    }));
  }
  // actualizarDepartamento(departamento : Departamento){
  //   let url = SERVER_API+"departamento/actualizarDepartamento";
  //   return this.http.post( url, departamento )
  //   .pipe(map( (resp: any) => {
  //     return resp;
  //   }), catchError(err => {
  //     Swal.fire("Ha ocurrido un error", err.error.data, 'error');
  //     return throwError(err);
  //   }));
  // }
  
  obtenerMoviemientosContratacionPorId(id : any){
    let url = SERVER_API+"contratacion/obtenerMoviemientosContratacionPorId/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }

  obtenerCatalogoNomina(){
    let url = SERVER_API+"contratacion/obtenerCatalogoNomina";
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }

  eliminarDetalleContratacion(json : any){
    let url = SERVER_API+"contratacion/eliminarDetalleContratacion";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.data, 'error');
      return throwError(err);
    }));
  }

  aplicarContratacion(id_movimiento : any, usuario_creacion : any){
    let url = SERVER_API+"contratacion/aplicarContratacion/"+id_movimiento+"/"+usuario_creacion;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }
}
