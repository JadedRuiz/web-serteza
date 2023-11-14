import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { PAcceso } from 'src/app/models/PuntosAcceso';
import { AccesosService } from 'src/app/services/puntos-acceso/accesos.service';

@Component({
  selector: 'app-catalogo-puntos-acceso',
  templateUrl: './catalogo-puntos-acceso.component.html',
  styleUrls: ['./catalogo-puntos-acceso.component.css']
})
export class CatalogoPuntosAccesoComponent implements OnInit {
  public cliente = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public sistema = parseInt(window.sessionStorage.getItem("sistema")+"");


  public punto_acceso = new PAcceso(0,0,'','','','',0,'',0)
public color = COLOR;
longitud:any = '';
latitud:any = '';
  constructor(
    public accesos_service : AccesosService
  ) { }

  ngOnInit(): void {
     this.ubicacion();
  }


  // CORDENADAS
  registrar(){
    this.ubicacion()
    Swal.fire({
      title: 'Guardando punto de acceso',
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
        Swal.close();
        // console.log('Lat Long', this.latitud, this.longitud);
      }, (error) => {
      });
    } else {
      console.error('El dispositivo no admite geolocalización.');
    }
  }

  guardar(){
    Swal.fire({
      title: 'Guardando punto de acceso',
      text: 'Por favor espere...',
      willOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,  // Evita que el usuario cierre el Swal haciendo clic fuera de él
      allowEscapeKey: false,
      showConfirmButton: false,     // Evita que el usuario cierre el Swal con la tecla Esc
    });
    let json = {
    id_reloj:0,
    id_cliente:this.cliente,
    ubicacion:this.punto_acceso.ubicacion,
    latitud:this.latitud,
    longitud:this.latitud,
    direccion_ip:this.punto_acceso.direccion_ip,
    distancia_km:this.punto_acceso.distancia_km,
    token:'token',
    id_usuario:0
    }
    this.accesos_service.guardarAccesos(json).subscribe(res =>{
      if(res.ok){

        console.log('json :>> ', res);
      }else {
        Swal.close();
        Swal.fire('error',res.message,'error');
        console.log('json :>> ', json);
        console.log('json :>> ', res);
      }
    })
  }

}
