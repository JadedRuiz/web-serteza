import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

    constructor(
        private cookies: CookieService,
        public http: HttpClient
    ) { }

    // obtenerMovimientosReclutamiento(id_cliente : any){
    //     let url = SERVER_API+"movimiento/obtenerMovimientosReclutamiento/"+id_cliente;
    //     return this.http.get(url);
    // }
    obtenerDetallePorIdCandidato(id_candidato : any){
        let url = SERVER_API+"movimiento/obtenerDetallePorIdCandidato/"+id_candidato;
        return this.http.get(url);
    }
    obtenerMovimientosReclutamiento(json : any){
        let url = SERVER_API+"movimiento/obtenerMovimientosReclutamiento";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    altaMovimiento(json : any){
        let url = SERVER_API+"movimiento/altaMovimiento";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    // modificarDepartamento(json : any){
    //     let url = SERVER_API+"departamento/modificarDepartamento";
    //     return this.http.post( url, json )
    //     .pipe(map( (resp: any) => {
    //     return resp;
    //     }), catchError(err => {
    //     Swal.fire("Ha ocurrido un error", err.error.message, 'error');
    //     return throwError(err);
    //     }));
    // }
    // eliminarPuesto(id_puesto : any){
    //     let url = SERVER_API+"departamento/eliminarPuesto/"+id_puesto;
    //     return this.http.get(url);
    // }
}