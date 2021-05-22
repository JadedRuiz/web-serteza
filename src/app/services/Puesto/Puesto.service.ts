import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerPuestosPorIdDepartamento(id : any){
    let url = SERVER_API+"puesto/obtenerPuestosPorIdDepartamento/"+id;
    return this.http.get(url);
  }

  eliminarPuesto(id : any){
    let url = SERVER_API+"puesto/eliminarPuesto/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }

}
