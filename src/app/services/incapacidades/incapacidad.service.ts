import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class IncapacidadService {

  constructor(public http: HttpClient) { }


  obternerIncapacidades(json: any) {
    let url = SERVER_API + 'incapacidad/consultarIncapacidades';
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

  guardarIncapacidad(json: any) {
    let url = SERVER_API + 'incapacidad/guardarIncapacidad';
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