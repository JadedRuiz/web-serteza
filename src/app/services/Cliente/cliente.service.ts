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

  obtenerClientes(sistema_empresa_id : number){
    let url = SERVER_API+"cliente/obtenerClientes/"+sistema_empresa_id;
    return this.http.get(url);
  }
  obtenerClientesPorId(id : number){
    let url = SERVER_API+"cliente/obtenerClientesPorId/"+id;
    return this.http.get(url);
  }
  altaCliente(cliente : Cliente){
    let url = SERVER_API+"cliente/altaCliente";
    return this.http.post( url, cliente )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }
  actualizarCliente(cliente : Cliente){
    let url = SERVER_API+"cliente/actualizarCliente";
    return this.http.post( url, cliente )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }
  eliminarCliente(id : any){
    let url = SERVER_API+"cliente/eliminarCliente/"+id;
    return this.http.get(url);
  }
}
