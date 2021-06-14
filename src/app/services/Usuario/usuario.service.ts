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

  login(usuario : Usuario){
    let url = SERVER_API+"usuario/login";
    return this.http.post( url, usuario )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  altaUsuario(json : any){
    let url = SERVER_API+"usuario/altaUsuario";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", 'El campo "usuario" que se intenta dar de alta ya se encuentra utilizado.', 'error');
        return throwError(err);
      }));
  }
  altaUsuarioAdmin(json : any){
    let url = SERVER_API+"usuario/altaUsuarioAdmin";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", 'El campo "usuario" que se intenta dar de alta ya se encuentra utilizado.', 'error');
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
  obtenerToken(){
    return this.cookies.get("token");
  }
  guardarToken(token: String){
    this.cookies.set("token",token+"");
  }
  logout(){
    this.cookies.delete("token");
  }
  obtenerUsuarios(json : any){
    let url = SERVER_API+"usuario/usuarios";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  obtenerSistemas(){
    let url = SERVER_API+"usuario/obtenerSistemas";
    return this.http.get(url);
  }
  obtenerSistemasAdmin(id : any){
    let url = SERVER_API+"usuario/obtenerSistemasAdmin/"+id;
    return this.http.get(url);
  }
  obtenerUsuarioPorId(id_usuario : any){
    let url = SERVER_API+"usuario/obtenerUsuarioPorId/"+id_usuario;
    return this.http.get(url);
  }
  obtenerUsuariosDeEntidad(json : any){
    let url = SERVER_API+"usuario/obtenerUsuariosDeEntidad";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  autoCompleteUsuario(json : any){
    let url = SERVER_API+"usuario/autoCompleteUsuario";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  autoCompletePorIdEmpresa(json : any){
    let url = SERVER_API+"usuario/autoCompletePorIdEmpresa";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  tieneSistema(json : any){
    let url = SERVER_API+"usuario/tieneSistema";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
}
