import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  constructor(
    public http: HttpClient
  ) { }

//   opcionesFactura(id : any,tipo : any){
//     let url = SERVER_API+"facturacion/opcionesFactura/"+id+"/"+tipo;
//     return this.http.get(url);
//   }
  
  obtenerFacturas(json : any){
    let url = SERVER_API+"facturacion/obtenerFacturas";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  generarExcel(json : any){
    let url = SERVER_API+"facturacion/generarExcel";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }
  
  opcionesFactura(json : any){
    let url = SERVER_API+"facturacion/opcionesFactura";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  descargaMasiva(json : any){
    let url = SERVER_API+"facturacion/descargaMasiva";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }
}