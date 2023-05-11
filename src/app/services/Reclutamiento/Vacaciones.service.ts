import { Injectable, ViewChild } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

    constructor(
        private cookies: CookieService,
        public http: HttpClient
    ) { }

    obtenerUltimasSolicitudes(id_perfil : any, id_empleado : any){
        let url = SERVER_API+"movimiento/obtenerUltimasSolicitudes/"+id_perfil+"/"+id_empleado;
        return this.http.get(url);
    }
    solicitarNueva(json : any){
        let url = SERVER_API+"movimiento/solicitarNueva";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
}