import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {

  constructor(
    public http: HttpClient
  ) { }
  
  facServiciosAutocomplete(json : any){
    let url = SERVER_API+"concepto/facServiciosAutocomplete";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  facUnidadesAutocomplete(json : any){
    let url = SERVER_API+"concepto/facUnidadesAutocomplete";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  facAltaConcepto(json : any){
    let url = SERVER_API+"concepto/facAltaConcepto";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  facModificarConcepto(json : any){
    let url = SERVER_API+"concepto/facModificarConcepto";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  facObtenerConceptosEmpresa(id : any){
    let url = SERVER_API+"concepto/facObtenerConceptosEmpresa/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  facObtenerConceptosPorId(id : any){
    let url = SERVER_API+"concepto/facObtenerConceptosPorId/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  autocomplete(json : any){
    let url = SERVER_API+"concepto/autocomplete";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  obtenerConcpetosPorId(id : any){
    let url = SERVER_API+"concepto/obtenerConcpetosPorId/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  obtenerConcpetosPorIdConcepto(id : any){
    let url = SERVER_API+"concepto/obtenerConcpetosPorIdConcepto/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  crearConcepto(json : any){
    let url = SERVER_API+"concepto/crearConcepto";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  
  modificarConcepto(json : any){
    let url = SERVER_API+"concepto/modificarConcepto";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  cambiarActivo(id : any,status : number){
    let url = SERVER_API+"concepto/cambiarActivo/"+id+"/"+status;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  altaConceptosAEmpleado(json : any){
    let url = SERVER_API+"concepto/altaConceptosAEmpleado";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  modificarConceptoAEmpleado(json : any){
    let url = SERVER_API+"concepto/modificarConceptoAEmpleado";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  obtenerConceptoPorIdMovNomina(id : any){
    let url = SERVER_API+"concepto/obtenerConceptoPorIdMovNomina/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  eliminarConceptoAEmpleado(json : any){
    let url = SERVER_API+"concepto/eliminarConceptoAEmpleado";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  obtenerConceptosPorIdEmpleado(id_empleado : any, id_empresa : any, id_periodo : any){
    let url = SERVER_API+"concepto/obtenerConceptosPorIdEmpleado/"+id_empleado+"/"+id_empresa+"/"+id_periodo;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
}
