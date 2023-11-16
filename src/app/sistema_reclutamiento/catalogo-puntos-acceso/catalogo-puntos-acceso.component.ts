import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { PAcceso } from 'src/app/models/PuntosAcceso';
import { AccesosService } from 'src/app/services/puntos-acceso/accesos.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-catalogo-puntos-acceso',
  templateUrl: './catalogo-puntos-acceso.component.html',
  styleUrls: ['./catalogo-puntos-acceso.component.css']
})
export class CatalogoPuntosAccesoComponent implements OnInit {
  public cliente = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public sistema = parseInt(window.sessionStorage.getItem("sistema")+"");
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

public punto_acceso = new PAcceso(0,0,'','','','',0,'',0)
public color = COLOR;
public accesos:any;
longitud:any = '';
latitud:any = '';
  constructor(
    public accesos_service : AccesosService
  ) { }

  ngOnInit(): void {
     this.ubicacion();
     this.obtenerAccesos();
  }


obtenerAccesos(){
  let json = {
    id_reloj: 0,
    id_cliente: this.cliente,
    ubicacion: "",
    solo_activos: 0,
    token: "012354SDSDS01"
  }
  this.accesos_service.consultarAccesos(json).subscribe(res => {
    if(res.ok){
      this.accesos = res.data
      console.log(res.data);
    }
  })
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
      icon: 'info',
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
        Swal.fire(
          'Exito',
          res.data.mensaje,
          'success'
        )
        this.punto_acceso = new PAcceso(0,0,'','','','',0,'',0)
       this.obtenerAccesos();
       Swal.close();
       console.log('json :>> ', res);

      }else {
       this.obtenerAccesos();
        Swal.fire('error',res.message,'error');
      }
    })
  }

  autorizar(a:any){
    console.log('a :>> ', a);
    Swal.fire({
      title: `¿${a.activo === 0 ? 'Autorizar' : 'Desactivar'} ${a.ubicacion}?`,
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
    let json = {
      id_reloj: a.id_reloj,
      token: 'token',
      id_usuario: 1
    }
    this.accesos_service.activarAccesos(json).subscribe(res=>{
      if(res.ok){
        Swal.fire('', 'PUNTO DE ACCESO DESACTIVADO', 'success')
        this.obtenerAccesos();
      }else{
        Swal.fire(res.message,'','error')
        // console.log('Ubicación editada',res);
      }
    })
      } else {
        // console.log('Edición cancelada');
      }
    });
  }

  editar(a:any){
   this.punto_acceso.ubicacion = a.ubicacion
   this.longitud = a.longitud
   this.latitud = a.latitud
   this.punto_acceso.direccion_ip = a.direccion_ip
   this.punto_acceso.distancia_km = a.distancia_km
   this.punto_acceso.id_reloj = a.id_reloj
   this.cambiartab(1);

    console.log(a);
  }

  actualizar(){
    let json = {
      id_reloj:this.punto_acceso.id_reloj,
      id_cliente:this.cliente,
      ubicacion:this.punto_acceso.ubicacion,
      latitud:this.latitud,
      longitud:this.latitud,
      direccion_ip:this.punto_acceso.direccion_ip,
      distancia_km:this.punto_acceso.distancia_km,
      token:'token',
      id_usuario:0
      }
      console.log('json :>> ', json);
      // this.accesos_service.guardarAccesos(json).subscribe(res =>{
      //   if(res.ok){
      //     Swal.fire(
      //       'Exito',
      //       res.data.mensaje,
      //       'success'
      //     )
      //     this.punto_acceso = new PAcceso(0,0,'','','','',0,'',0)
      //    this.obtenerAccesos();
      //    Swal.close();
      //    console.log('json :>> ', res);

      //   }else {
      //    this.obtenerAccesos();
      //     Swal.fire('error',res.message,'error');
      //   }
      // })
  }



  nuevo(){
   console.log('nuevo')
  }
  cambiartab(nuevoIndice: number) {
    this.tabGroup.selectedIndex = nuevoIndice;
  }

}
