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

  obtenerContratados(id_puesto : any){
    let url = SERVER_API+"obtenerContratados/"+id_puesto;
    return this.http.get(url);
  }
}