import { Injectable } from '@angular/core';
import { API_AUD } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { throwError } from 'rxjs';


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



// Calculo Integrado
calculoIntegrado(json:any){
let url = API_AUD + "calculoIntegrados";
return this.http.post(url,json)
.pipe(map((resp:any)=>{
  return resp;
}), catchError(err => {
  Swal.fire("Ha ocurrido un error en el servicio", err.error.message, 'error');
  return throwError(err);
}));
 }

}
