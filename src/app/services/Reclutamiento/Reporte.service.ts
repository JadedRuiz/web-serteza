import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Empleado } from 'src/app/models/Empleado';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(
    public http: HttpClient
  ) { }

  reporteContrato(id : any){
    let url = SERVER_API+"reporte/reporteContratado/"+id;
    return this.http.get( url )
    .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
    }));
  }

  reporteModificacion(id : any){
    let url = SERVER_API+"reporte/reporteModificacion/"+id;
    return this.http.get( url )
    .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
    }));
  }

  reporteGeneral(id : any){
    let url = SERVER_API+"reporte/reporteContrato/"+id;
    return this.http.get( url )
    .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
    }));
  }

  reporteDepartamento(id : any, id_cliente : any){
    let url = SERVER_API+"reporte/reporteDepartamento/"+id+"/"+id_cliente;
    return this.http.get( url )
    .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
    }));
  }
//   cargaEmpleado(empleado : any){
//     let url = SERVER_API+"empleado/cargaEmpleado";
//     return this.http.post( url, empleado )
//       .pipe(map( (resp: any) => {
//         return resp;
//       }), catchError(err => {
//         Swal.fire("Ha ocurrido un error", err.error, 'error');
//         return throwError(err);
//       }));
//   }
}