import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Baja } from 'src/app/models/Baja';

@Injectable({
  providedIn: 'root'
})
export class BajaService {

  constructor(
    public http: HttpClient
  ) { }

  crearSolicitudDeBaja(baja : Baja){
      let url = SERVER_API + "baja/crearSolicitudDeBaja";
      return this.http.post( url, baja)
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  modificarDetalleSolicitud(baja : Baja){
    let url = SERVER_API + "baja/modificarDetalleSolicitud";
    return this.http.post( url, baja)
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  obtenerSolicitudesBaja(json : any){
    let url = SERVER_API + "baja/obtenerSolicitudesBaja";
    return this.http.post( url, json)
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  obtenerDetalleSolicitudBaja(id : any){
    let url = SERVER_API+"baja/obtenerDetalleSolicitudBaja/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  eliminarDetalle(id : any){
    let url = SERVER_API+"baja/eliminarDetalle/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  aplicarBaja(id : any){
    let url = SERVER_API+"baja/aplicarBaja/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
}
