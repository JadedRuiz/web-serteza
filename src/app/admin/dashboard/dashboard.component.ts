import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import swal from'sweetalert2';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { Router } from '@angular/router';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public color = COLOR;
  public valores_info = Array();
  constructor(
    public usuario : UsuarioService,
    public candidato : CandidatoService,
    private router : Router
    ) { }
  ngOnInit(): void {
    this.pintarDashboard();
  }
  pintarDashboard(){
    //Sistema de Recursos Humanos
    if(window.sessionStorage.getItem("sistema") == "1"){
      this.candidato.obtenerDatos()
      .subscribe( (objecto : any) => {
        if(objecto.ok){
          this.valores_info = [
            {"title" : "Num. de solicitudes", "valor" : objecto.data.num_solicitudes},
            {"title" : "Contratados", "valor" : objecto.data.contratados},
            {"title" : "Por contratar", "valor" : objecto.data.por_contratar},
            {"title" : "Total", "valor" : objecto.data.total}
          ];
        }
      });
    }
  }
}
