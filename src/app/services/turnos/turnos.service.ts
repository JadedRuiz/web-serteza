import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(public http: HttpClient) {}


  obtenerTurnos(json: any) {
    let url = SERVER_API + 'turnos/consultarTurnos';
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



  agregarTurnos(json: any) {
    let url = SERVER_API + 'turnos/guardarTurno';
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


  activarTurno(json: any) {
    let url = SERVER_API + 'turnos/activarTurno';
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

// PARA ASIGNAR TURNOS
asignarTurno(json: any) {
  let url = SERVER_API + 'candidato/guardarDato';
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

turnosAsignados(json: any) {
  let url = SERVER_API + 'candidato/buscarDato';
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
