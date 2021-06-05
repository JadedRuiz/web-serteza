import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {

  constructor(
    public http: HttpClient,
  ) { }

  altaXML(obj : any){
    console.log(obj);
    let url = SERVER_API+"usuario/upload-xml";
    return this.http.post( url, obj )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.data, 'error');
        return throwError(err);
      }));
  }
}
