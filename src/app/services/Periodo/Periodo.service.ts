import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  constructor(
    public http: HttpClient
  ) { }

  fechaFinalEjercicio(anio : any,id_empresa : number, id_nomina : number){
    let url = SERVER_API+"periodo/fechaFinalEjercicio/"+anio+"/"+id_empresa+"/"+id_nomina;
    return this.http.get(url);
  }

  crearNuevoPeriodo(json : any){
    let url = SERVER_API+"periodo/crearNuevoPeriodo";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  modificarPeriodo(json : any){
    let url = SERVER_API+"periodo/modificarPeriodo";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  obtenerPeriodos(json : any){
    let url = SERVER_API+"periodo/obtenerPeriodos";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  obtenerPeriodoPorId(id_periodo : any){
    let url = SERVER_API+"periodo/obtenerPeriodoPorId/"+id_periodo;
    return this.http.get(url);
  }
  
  obtenerPeriodoEjercicioActual(id_empresa : any,id_nomina : any){
    let url = SERVER_API+"periodo/obtenerPeriodoEjercicioActual/"+id_empresa+"/"+id_nomina;
    return this.http.get(url);
  }
}