import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { COLOR } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { interval } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public id_candidato = parseInt(window.sessionStorage.getItem("candidato")+"");
  public perfil = parseInt(window.sessionStorage.getItem("perfil")+"");
  public color = COLOR;
  longitud:any = '';
  latitud:any = '';
  fecha:string = ''
  public foto_empresa : any //

  constructor(
    private router: Router,
    private candidato_service: CandidatoService,
    private cliente_service : ClienteService,



  ) { }

  ngOnInit(): void {
    this.mostrarLogo()
    interval(1000).subscribe(() => {
      this.actualizarFechaYHora();
    });
    console.log(
     'idusuario=>',this.usuario_logueado,
     'idCliente=>',this.id_cliente,
     'Perfil=>',this.perfil,
     'idCandidato=>', this.id_candidato)
  }



  actualizarFechaYHora() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    this.fecha = now.toLocaleDateString('es-ES', options);
  }

  // PARA IMAGEN
  mostrarLogo(){
    if(window.sessionStorage.getItem("cliente") != null){
      let id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
      this.cliente_service.obtenerClientesPorId(id_cliente)
      .subscribe( (object : any) => {
        if(object.ok){
          this.foto_empresa = ""+object.data[0].fotografia+"";
        }
      });
    }else{
      this.foto_empresa = "./assets/img/defaults/imagen-empresa-default.png";
    }
  }



// GUARDAR COORDENADAS

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
        this.check();
      }, (error) => {
      });
    } else {
      console.error('El dispositivo no admite geolocalización.');
    }

  }


check(){

  let json = {
    id_candidato: this.id_candidato,
    id_cliente: this.id_cliente,
    fecha: "",
    hora: "",
    id_reloj: 0,
    reloj_checador: 0,
    longitud: this.latitud,
    latitud: this.longitud,
  }
  console.error('El',json);

  this.candidato_service.guardarChecada(json).subscribe((resp)=>{
    Swal.close();
    if(resp.ok){
      Swal.fire(
        'Exito',resp.mensaje,'success'
      )
    }else {
      Swal.fire(
        'Error',resp.mensaje,'error'
      );
    }
  })
}

  entradasSalidas(){
    this.router.navigate(['/sistema_reclutamiento/bitacora-insidencias']);

  }

  recibos(){
    this.router.navigate(['/sistema_reclutamiento/proced_xml']);

  }

}

