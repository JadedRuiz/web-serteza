import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CompartidoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerCatalogo(nombre_tabla : any){
    let url = SERVER_API+"obtenerCatalogo/"+nombre_tabla+"/0";
    return this.http.get(url);
  }
}