import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Empresa } from 'src/app/models/Empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

    constructor(
        public http: HttpClient,
        private usuario_service: UsuarioService
        ) { }

    obtenerEmpresas(sistema_id : number){
        let url = SERVER_API+"empresa/obtenerEmpresas/"+sistema_id;
        return this.http.get(url);
    }
    obtenerEmpresaPorId(id : number){
        let url = SERVER_API+"empresa/obtenerEmpresaPorId/"+id;
        return this.http.get(url)
        .pipe(map( (resp: any) => {
            return resp;
          }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.data, 'error');
            return throwError(err);
          }));
    }
    altaEmpresa(empresa : Empresa){
      let url = SERVER_API+"empresa/altaEmpresa";
      return this.http.post( url, empresa )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
    }
    actualizarEmpresa(empresa : Empresa){
      let url = SERVER_API+"empresa/actualizarEmpresa";
      return this.http.post( url, empresa )
        .pipe(map( (resp: any) => {
          return resp;
        }), catchError(err => {
          Swal.fire("Ha ocurrido un error", err.error.data, 'error');
          return throwError(err);
        }));
    }
    bajaEmpresa(id : any){
      let url = SERVER_API+"empresa/bajaEmpresa/"+id;
      return this.http.get(url);
    }
}
