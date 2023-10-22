import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { COLOR } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';

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
  public color = COLOR;
  longitud:any = '';
  latitud:any = '';

  constructor(
    private router: Router,
    private candidato_service: CandidatoService,


  ) { }

  ngOnInit(): void {
    console.log(this.usuario_logueado, 'idCliente=>',this.id_cliente, this.id_candidato)
  }

// GUARDAR COORDENADAS

  registrar(){
    this.ubicacion()
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
      console.error('El navegador no admite geolocalización.');
    }

  }


check(){
  let json = {
    id_candidato: 1249,
    id_cliente: 5,
    fecha: "",
    hora: "",
    id_reloj: 0,
    reloj_checador: 0,
    longitud: this.latitud,
    latitud: this.longitud,
  }
  this.candidato_service.guardarChecada(json).subscribe((resp)=>{
    if(resp.ok){
      Swal.fire(
        'Exito',resp.message,'success'
      )
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

