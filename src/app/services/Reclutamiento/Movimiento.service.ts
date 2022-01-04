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

    obtenerDetallePorId(id_mov : any){
        let url = SERVER_API+"movimiento/obtenerDetallePorId/"+id_mov;
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
    cancelarMovimiento(id_mov : any){
        let url = SERVER_API+"movimiento/cancelarMovimiento/"+id_mov;
        return this.http.get(url);
    }
    cancelarDetalle(id_detalle : any){
        let url = SERVER_API+"movimiento/cancelarDetalle/"+id_detalle;
        return this.http.get(url);
    }
    modificarDetalle(json : any){
        let url = SERVER_API+"movimiento/modificarDetalle";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    modificarMovimiento(json : any){
        let url = SERVER_API+"movimiento/modificarMovimiento";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    cambiarStatusMov(id_status : any, id_mov : any){
        let url = SERVER_API+"movimiento/cambiarStatusMov/"+id_status+"/"+id_mov;
        return this.http.get(url);
    }
    aplicarMovimiento(json : any){
        let url = SERVER_API+"movimiento/aplicarMovimiento";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    obtenerDetalleBaja(id_mov : any){
        let url = SERVER_API+"movimiento/obtenerDetalleBaja/"+id_mov;
        return this.http.get(url);
    }
}