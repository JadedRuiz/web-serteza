import { Injectable } from '@angular/core';
import { API_AUD } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


@Injectable({
  providedIn: 'root'
})
export class CalculoService {

  constructor(
    private http: HttpClient,
    ) { }


//Obtener empleados
 obtenerEmpleados(json:any){
let url = API_AUD + "empleadosCalcular";
return this.http.post(url,json)
.pipe(map((resp:any)=>{
  return resp;
}), catchError(err => {
  Swal.fire("Ha ocurrido un error", err.error.message, 'error');
  return throwError(err);
}));
 }


//  OBTENER XML DEL TRABAJDOR
 obtenerXml(json:any){
let url = API_AUD + "empleadosXML";
return this.http.post(url,json)
.pipe(map((resp:any)=>{
  return resp;
}), catchError(err => {
  Swal.fire({
    icon: 'error',
    title: 'Error al buscar trabajadores',
    text: 'Hubo un problema al buscar los trabajadores. Inténtalo de nuevo más tarde.',
  });
  return throwError(err);
}));
 }



// Calculo Integrado
calculoIntegrado(json:any){
let url = API_AUD + "calculoIntegrados";
return this.http.post(url,json)
.pipe(map((resp:any)=>{
  return resp;
}), catchError(err => {
  Swal.fire("Ha ocurrido un error en el servicio", err.message, 'error');
  return throwError(err);
}));
 }


//Detalles de trabajador
detalleXML(json : any){
let url = API_AUD + "detalleXML";
return this.http.post(url,json)
.pipe(map((resp:any)=>{
  return resp;
}), catchError(err=>{
Swal.fire("Ha ocurrido un error de servicio", err.message,'error');
return throwError(err);
}));
}


//Exportar Exel
exportarExcel(json: any){
  let url = API_AUD + "exportarExcel";
  return this.http.post(url,json)
  .pipe(map((resp:any)=>{
    return resp;
  }), catchError(err=>{
    Swal.fire("Ha ocurrido un error de servicio", err.message,'error');
    return throwError(err);
    }));
    }


 //EXPORTAR VARIABLES
 variables(json:any){
  let url = API_AUD + "variables";
  return this.http.post(url,json)
  .pipe(map((resp:any)=>{
    return resp;
  }), catchError(err=>{
    Swal.fire("Ha ocurrido un error de servicio", err.message,'error');
    return throwError(err);
    }));
    }

//Acumulados de nomina
acumuladosNomina(json:any){
 let url = API_AUD + "acumulados";
 return this.http.post(url,json)
 .pipe(map((resp:any)=>{
  return resp;
 }), catchError(err=>{
  Swal.fire("Ha ocurrido un error de servicio", err.message,'error');
  return throwError(err);
  }));
  }

}
