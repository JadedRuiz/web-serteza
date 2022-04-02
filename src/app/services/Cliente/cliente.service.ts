import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { Cliente } from 'src/app/models/Cliente';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    public http: HttpClient,
    private usuario_service: UsuarioService
    ) { }

  obtenerClientes( json : any ){
    let url = SERVER_API+"cliente/obtenerClientes";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  obtenerClientesPorId(id : number){
    let url = SERVER_API+"cliente/obtenerClientesPorId/"+id;
    return this.http.get(url);
  }
  obtenerClientePorIdUsuario(id : any){
    let url = SERVER_API+"cliente/obtenerClientePorIdUsuario/"+id;
    return this.http.get(url);
  }
  altaCliente(cliente : Cliente){
    let url = SERVER_API+"cliente/altaCliente";
    return this.http.post( url, cliente )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  actualizarCliente(cliente : Cliente){
    let url = SERVER_API+"cliente/actualizarCliente";
    return this.http.post( url, cliente )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  asignarClienteAUsuario(json : any){
    let url = SERVER_API+"cliente/asignarClienteAUsuario";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  eliminarCliente(id : any){
    let url = SERVER_API+"cliente/eliminarCliente/"+id;
    return this.http.get(url);
  }
  obtenerClientesPorIdEmpresa(id : any){
    let url = SERVER_API+"cliente/obtenerClientesPorIdEmpresa/"+id;
    return this.http.get(url);
  }
  eliminarLiga(json : any){
    let url = SERVER_API+"cliente/elimiminarLiga";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  autoCompleteCliente(json : any){
    let url = SERVER_API+"cliente/autoCompleteCliente";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  facObtenerClientes(id_empresa : any){
    let url = SERVER_API+"cliente/facObtenerClientes/"+id_empresa;
    return this.http.get(url);
  }
  facObtenerClientesPorId(id : any){
    let url = SERVER_API+"cliente/facObtenerClientesPorId/"+id;
    return this.http.get(url);
  }
  facAltaCliente(json : any){
    let url = SERVER_API+"cliente/facAltaCliente";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
}
