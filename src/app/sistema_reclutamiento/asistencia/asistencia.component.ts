import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  public color = COLOR;
  longitud:any = '';
  latitud:any = '';

  constructor() { }

  ngOnInit(): void {
  }


  registrar(){
    this.ubicacion()
    Swal.fire(
      'Excelente',
      'Asistencia registrada',
      'success'
    )
  }

  ubicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitud = position.coords.longitude;
        this.latitud = position.coords.latitude;
        console.log('Lat Long', this.latitud, this.longitud);
      }, (error) => {
      });
    } else {
      console.error('El navegador no admite geolocalización.');
    }
  }

}