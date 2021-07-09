import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Banco } from 'src/app/models/Banco';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerBancos(json : any){
    let url = SERVER_API+"bancos/get-bancos";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }
  altaBanco(banco : Banco){
    let url = SERVER_API+"bancos/altaCandidato";
    return this.http.post( url, banco )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  actualizarBanco(banco : Banco){
    let url = SERVER_API+"bancos/actualizarBanco";
    return this.http.post( url, banco )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  
  eliminarBanco(id : any){
    let url = SERVER_API+"bancos/eliminarBanco/"+id;
    return this.http.get(url);
  }
  autoCompleteBanco(json : any){
    let url = SERVER_API+"bancos/get-bancos";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }
}
