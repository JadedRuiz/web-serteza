import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: number) {
    return new Promise((resolve, reject) => {
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('archivo', archivo, archivo.name);

    // tslint:disable-next-line:only-arrow-functions
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
                      resolve( JSON.parse( xhr.response ));

          } catch (error) {
            
          }
        } else {
          reject(xhr.response);
        }
      }
    };
    const url = 'API_SERTEZA' + '/' + tipo +'/subir-archivo/' + id;
    xhr.open('POST', url, true);
    xhr.send(formData);
    });
  }
}