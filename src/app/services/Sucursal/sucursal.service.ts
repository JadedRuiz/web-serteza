import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor(
    public http: HttpClient
    ) { }

  crearSucursal(json : any){
    let url = SERVER_API+"sucursal/crearSucursal";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }
  obtenerSucursales(id : any){
    let url = SERVER_API+"sucursal/obtenerSucursales/"+id;
    return this.http.get(url);
  }
  modificarSucursal(json : any){
    let url = SERVER_API+"sucursal/modificarSucursal";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }
  obtenerSucursalPorIdSucursal(id : any){
    let url = SERVER_API+"sucursal/obtenerSucursalPorIdSucursal/"+id;
    return this.http.get(url);
  }
}