import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class JustificacionService {

  constructor( public http : HttpClient ) { }


  obternerJustificaciones(json: any) {
    let url = SERVER_API + 'incidencias/consultarJustificaciones';
    return this.http.post(url, json).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        // Swal.fire('Ha ocurrido un error', err.error.message, 'error');
        return throwError(err);
      })
    );
  }


  guardarJustificacion(json: any) {
    let url = SERVER_API + 'incidencias/guardarJustificacion';
    return this.http.post(url, json).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        Swal.fire('Ha ocurrido un error', err.error.message, 'error');
        return throwError(err);
      })
    );
  }
  activarJustificacion(json: any) {
    let url = SERVER_API + 'incidencias/activarJustificacion';
    return this.http.post(url, json).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        Swal.fire('Ha ocurrido un error', err.error.message, 'error');
        return throwError(err);
      })
    );
  }
  autorizarJustificacion(json: any) {
    let url = SERVER_API + 'incidencias/autorizarJustificacion';
    return this.http.post(url, json).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        Swal.fire('Ha ocurrido un error', err.error.message, 'error');
        return throwError(err);
      })
    );
  }
}
