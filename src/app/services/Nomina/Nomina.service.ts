import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NominaService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerNombreNominaPorId(id : any){
    let url = SERVER_API+"nomina/obtenerNombreNominaPorId/"+id;
    return this.http.get(url);
  }
  
  obtenerLigaEmpresaNomina(json : any){
    let url = SERVER_API+"nomina/obtenerLigaEmpresaNomina";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  insertarLigaNominaEmpresa(json : any){
    let url = SERVER_API+"nomina/insertarLigaNominaEmpresa";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  eliminarLigaEmpresaNomina(json : any){
    let url = SERVER_API+"nomina/eliminarLigaEmpresaNomina";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  activarLigaEmpresaNomina(id : any){
    let url = SERVER_API+"nomina/activarLigaEmpresaNomina/"+id;
    return this.http.get(url);
  }

  aplicarSolicitudesRH(json : any){
    let url = SERVER_API+"nomina/aplicarSolicitudesRH";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
}