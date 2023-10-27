import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-puntos-acceso',
  templateUrl: './catalogo-puntos-acceso.component.html',
  styleUrls: ['./catalogo-puntos-acceso.component.css']
})
export class CatalogoPuntosAccesoComponent implements OnInit {
public color = COLOR;
longitud:any = '';
latitud:any = '';
  constructor() { }

  ngOnInit(): void {
    // this.registrar();
  }

  buscarCandidato(){ }
  guardarUsuario(){}

  // CORDENADAS
  registrar(){
    this.ubicacion()
    Swal.fire({
      title: 'Registrando',
      text: 'Por favor espere...',
      willOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,  // Evita que el usuario cierre el Swal haciendo clic fuera de él
      allowEscapeKey: false,
      showConfirmButton: false,     // Evita que el usuario cierre el Swal con la tecla Esc
    });
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
      console.error('El dispositivo no admite geolocalización.');
    }

  }

}
