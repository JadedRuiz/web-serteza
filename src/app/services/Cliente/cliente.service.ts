import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    public http: HttpClient,
    private usuario_service: UsuarioService
    ) { }

  obtenerClientes(sistema_empresa_id : number){
    let url = SERVER_API+"cliente/obtenerClientes/"+sistema_empresa_id+"/"+this.usuario_service.obtenerToken();
    return this.http.get(url);
  }
}
