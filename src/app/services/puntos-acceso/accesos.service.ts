import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AccesosService {

  constructor(
    public http: HttpClient
  ) { }


  consultarAccesos(json : any){
    let url = SERVER_API+"reloj/consultarRelojes";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", '', 'error');
        return throwError(err);
      }));
  }



  guardarAccesos(json : any){
    let url = SERVER_API+"reloj/guardarReloj";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", '', 'error');
        return throwError(err);
      }));
  }


  activarAccesos(json : any){
    let url = SERVER_API+"reloj/activarReloj";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", '', 'error');
        return throwError(err);
      }));
  }

}
