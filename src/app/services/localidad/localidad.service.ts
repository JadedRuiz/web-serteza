import { Injectable } from '@angular/core';
import { SERVER_CP } from 'src/config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {

  constructor(public http: HttpClient) { }

  getDirrecion(cp : any){
    let url = SERVER_CP+'info_cp/'+cp;
    return this.http.get(url);
  }
}
