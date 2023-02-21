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
export class DepartamentoService {

    constructor(
        private cookies: CookieService,
        public http: HttpClient
    ) { }

    obtenerDepartamentosPorIdEmpresa(id_empresa : any){
        let url = SERVER_API+"departamento/obtenerDepartamentosPorIdEmpresa/"+id_empresa;
        return this.http.get(url);
    }
    obtenerDepartamentoPorId(id_departamento : any){
        let url = SERVER_API+"departamento/obtenerDepartamentoPorId/"+id_departamento;
        return this.http.get(url);
    }
    obtenerDepartamentosPorIdCliente(json : any){
        let url = SERVER_API+"departamento/obtenerDepartamentosPorIdCliente";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    altaDepartamento(json : any){
        let url = SERVER_API+"departamento/altaDepartamento";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    modificarDepartamento(json : any){
        let url = SERVER_API+"departamento/modificarDepartamento";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    eliminarPuesto(id_puesto : any){
        let url = SERVER_API+"departamento/eliminarPuesto/"+id_puesto;
        return this.http.get(url);
    }
    obtenerPDF(json : any){
        let url = SERVER_API+"reporte/reporteDepartamento";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));   
    }
}