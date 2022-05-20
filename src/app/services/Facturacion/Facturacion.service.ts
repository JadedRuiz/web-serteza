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

  facObtenerFolio(id : any){
    let url = SERVER_API+"facturacion/facObtenerFolio/"+id;
    return this.http.get(url);
  }
  
  facAltaFactura(json : any){
    let url = SERVER_API+"facturacion/facAltaFactura";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  facObtenerOperadores(id : any){
    let url = SERVER_API+"facturacion/facObtenerOperadores/"+id;
    return this.http.get(url);
  }

  facAltaOperador(json : any){
    let url = SERVER_API+"facturacion/facAltaOperador";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error, 'error');
      return throwError(err);
    }));
  }

  facObtenerTransporte(id : any, tipo : any){
    let url = SERVER_API+"facturacion/facObtenerTransporte/"+id+"/"+tipo;
    return this.http.get(url);
  }

  facObtenerPersona(id : any){
    let url = SERVER_API+"facturacion/facObtenerPersona/"+id;
    return this.http.get(url);
  }

  facAltaPersona(json : any){
    let url = SERVER_API+"facturacion/facAltaPersona";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error, 'error');
      return throwError(err);
    }));
  }

  facAltaVehiculo(json : any){
    let url = SERVER_API+"facturacion/facAltaVehiculo";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  facObtenerUbicacion(json : any){
    let url = SERVER_API+"facturacion/facObtenerUbicacion";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  facAltaUbicacion(json : any){
    let url = SERVER_API+"facturacion/facAltaUbicacion";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }
  
  getImportMercancias(){
    let url = SERVER_API+"facturacion/getImportMercancias";
    return this.http.get(url);
  }

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
      }));
  }

  preview(json : any){
    let url = SERVER_API+"facturacion/getPDFPreview";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  facObtenerFacturas(json : any){
    let url = SERVER_API+"facturacion/facObtenerFacturas";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error, 'error');
        return throwError(err);
      }));
  }

  // facSubirXML(json : any){
  //   let url = SERVER_API+"facturacion/altaBobedaXML";
  //   return this.http.post( url, json )
  //     .pipe(map( (resp: any) => {
  //       return resp;
  //     }), catchError(err => {
  //       Swal.fire("Ha ocurrido un error", err.error, 'error');
  //       return throwError(err);
  //     }));
  // }

  facGenerarFactura(id_factura : number, tipo : number, tipo_envio : number){
    let url = SERVER_API+"reporte/generarFactura/"+id_factura+"/"+tipo+"/"+tipo_envio;
    return this.http.get(url);
  }
}