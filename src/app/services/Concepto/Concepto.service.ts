import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {

  constructor(
    public http: HttpClient
  ) { }

  autocomplete(json : any){
    let url = SERVER_API+"concepto/autocomplete";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.data, 'error');
      return throwError(err);
    }));
  }

  obtenerConcpetosPorId(id : any){
    let url = SERVER_API+"concepto/obtenerConcpetosPorId/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }

  obtenerConcpetosPorIdConcepto(id : any){
    let url = SERVER_API+"concepto/obtenerConcpetosPorIdConcepto/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }

  crearConcepto(json : any){
    let url = SERVER_API+"concepto/crearConcepto";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.data, 'error');
      return throwError(err);
    }));
  }
  
  modificarConcepto(json : any){
    let url = SERVER_API+"concepto/modificarConcepto";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.data, 'error');
      return throwError(err);
    }));
  }

  cambiarActivo(id : any,status : number){
    let url = SERVER_API+"concepto/cambiarActivo/"+id+"/"+status;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }

}
