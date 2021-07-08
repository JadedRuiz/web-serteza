import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BancoSat } from 'src/app/models/BancoSat';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BancoSatService {

  constructor(
    public http: HttpClient
  ) { }

  getElementoPaginacion( desde2: number = 0) {

    const url = SERVER_API + '/bancos/get-bancos';
    const busqueda = { desde: desde2 };
    return this.http.post( url, busqueda )
    .pipe(map( (resp: any) => {
      return resp.data;
    }));
  }

  traerBancosSat(BancoSatID:Number = 0) {

    const url = SERVER_API + '/bancossat/get-bancos-sat';
    const busqueda = { bancosatid:BancoSatID};
    return this.http.post( url, busqueda )
    .pipe(map( (resp: any) => {
      return resp.data;
    }));
  }

}
