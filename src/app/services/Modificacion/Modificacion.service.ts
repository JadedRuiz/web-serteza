import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Modificacion } from 'src/app/models/Modificacion';

@Injectable({
  providedIn: 'root'
})
export class ModificacionService {

  constructor(
    public http: HttpClient
  ) { }

  crearSolicitudDeModificacion( mod : Modificacion){
      let url = SERVER_API + "modificacion/solicitudDeModificacion";
      return this.http.post( url, mod)
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  modificarDetalleModificacion(mod : Modificacion){
    let url = SERVER_API + "modificacion/modificarDetalleModificacion";
    return this.http.post( url, mod)
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  obtenerSolicitudesBaja(json : any){
    let url = SERVER_API + "modificacion/obtenerModificaciones";
    return this.http.post( url, json)
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  obtenerDetalleModificacion(id : any){
    let url = SERVER_API+"modificacion/obtenerDetalleModificacion/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }
  eliminarDetalle(id : any){
    let url = SERVER_API+"modificacion/eliminarDetalle/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }
//   aplicarBaja(id : any){
//     let url = SERVER_API+"baja/aplicarBaja/"+id;
//     return this.http.get(url)
//     .pipe(map( (resp: any) => {
//         return resp;
//       }), catchError(err => {
//         Swal.fire("Ha ocurrido un error", err.error.data, 'error');
//         return throwError(err);
//       }));
//   }
}
