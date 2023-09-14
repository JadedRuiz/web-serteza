import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheTrabService {

  constructor() { }


  private cachedData: any = null;

  // Método para guardar datos en caché
  saveData(data: any) {
    this.cachedData = data;
  }

  // Método para recuperar datos de caché
  getData() {
    return this.cachedData;
  }
  
}
