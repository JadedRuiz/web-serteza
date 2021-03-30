import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from '@angular/common/http';
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

  obtenerEmpresas(sistema_id : number){
    let url = SERVER_API+"empresa/obtenerEmpresas/"+sistema_id;
    return this.http.get(url);
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
}
