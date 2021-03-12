import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Candidato } from 'src/app/models/Candidato';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerDatos(){
    let url = SERVER_API+"candidato/obtenerDatos";
    return this.http.get(url);
  }
  altaCandidato(candidato : Candidato){
    let url = SERVER_API+"candidato/altaCandidato";
    return this.http.post( url, candidato )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }
}
