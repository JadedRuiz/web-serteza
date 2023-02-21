import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    constructor(
        private cookies: CookieService,
        public http: HttpClient
    ) { }

    obtenerUsuariosReclutamiento(id_cliente : any){
        let url = SERVER_API+"usuario/obtenerUsuariosReclutamiento/"+id_cliente;
        return this.http.get(url);
    }

    obtenerUsuariosReclutamientoPorId(id_usuario : any){
        let url = SERVER_API+"usuario/obtenerUsuariosReclutamientoPorId/"+id_usuario;
        return this.http.get(url);
    }

    activarDesactivarUsuario(id_usuario : any, activo : number){
        let url = SERVER_API+"usuario/activarDesactivarUsuario/"+id_usuario+"/"+activo;
        return this.http.get(url);
    }

    altaUsuarioAdmin(json : any){
        let url = SERVER_API+"usuario/altaUsuarioAdmin";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
        return resp;
        }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
        }));
    }
    modificarUsuario(json : any){
        let url = SERVER_API+"usuario/modificarUsuario";
        return this.http.post( url, json )
          .pipe(map( (resp: any) => {
            return resp;
          }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
          }));
    }
}