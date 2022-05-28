import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DescargaMasivaService {

  constructor(
    public http: HttpClient,
  ) { }


  crearSolicitudes(obj: any){
    let url = SERVER_API + "facturacion/crear-solicitud-sat";
    return this.http.post( url, obj )
    .pipe(map( (resp: any) => {
      Swal.fire('Solicitud creadq exitósamente', '' , 'success');
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
    
  }
  cancelarSolicitud(obj: any){
    let url = SERVER_API + "facturacion/cancelar-solicitud-sat";
    return this.http.post( url, obj )
    .pipe(map( (resp: any) => {
      Swal.fire('Solicitud cancelada exitósamente', '' , 'success');
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
    
  }
  cargarSolicitud(obj: any){
    let url = SERVER_API + "facturacion/descargar-solicitud-sat";
    return this.http.post( url, obj )
    .pipe(map( (resp: any) => {
      Swal.fire('Solicitud cargada exitósamente', '' , 'success');
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
    
  }
  actualizarSolicitud(obj: any){
    let url = SERVER_API + "facturacion/verificar-solicitud-sat";
    return this.http.post( url, obj )
    .pipe(map( (resp: any) => {
      Swal.fire('Solicitud actualizada exitósamente', '' , 'success');
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
    
  }
  getSolicitudes(id_empresa: number = 0, id_estatus: number = 0){
    let url = SERVER_API+"facturacion/get-solicitudes-sat/" + id_empresa + '/' + id_estatus ;
    return this.http.get(url);
  }
  


  
}
