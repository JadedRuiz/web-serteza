import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class FestivosService {
  constructor(public http: HttpClient) {}

  obternerFestivos(json: any) {
    let url = SERVER_API + 'diafestivo/consultarDiasFestivos';
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


  guardarFestivos(json: any) {
    let url = SERVER_API + 'diafestivo/guardarDiaFestivo';
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
