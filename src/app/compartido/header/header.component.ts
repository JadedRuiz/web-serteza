import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/Empleado/empleado.service';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado';
import { Candidato } from 'src/app/models/Candidato';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre = window.sessionStorage.getItem("nombre");
  public url_foto = window.sessionStorage.getItem("foto_user");
  public band = false;
  keyword = 'nombre';
  data = new Array;
  constructor(private router: Router,
    public empleado: EmpleadoService,
    public usuario: UsuarioService,
    public candidato: CandidatoService
    ) {
      
     }

  ngOnInit(): void {
  }
  autocomplete(){
    if(this.router.url.toString().includes("recursos_humanos")){
      // this.getEmpleadoService();
    }
    if(this.router.url.toString().includes("catalogo_candidato")){
      let arreglo = new Array();
      let id = parseInt(window.sessionStorage.getItem("cliente")+"");
      this.candidato.obtenerCandidatosPorIdCliente(id)
      .subscribe( (object : any) => {
        if(object.ok){
          for(let i=0;i<object.data.length;i++){
            arreglo.push({
              "nombre" : object.data[i].nombre,
              "id" : object.data[i].id
            });
          }
          this.data = arreglo;
        }else{
          this.data = [];
        }
      });
    }
    if(this.router.url.toString().includes("catalogo_cliente")){
      this.data = [];
    }
  }
  selectEvent(event : any){
    // location.href = "recursos_humanos/"+event.id;
    if(this.router.url.toString().includes("recursos_humanos")){
      // this.getEmpleadoService();
    }
    if(this.router.url.toString().includes("catalogo_candidato")){
      this.router.navigateByUrl("/catalogo_candidato/"+event.id);
    }
  }
  cerrarSesion(){
    this.usuario.logout();
    window.localStorage.removeItem("sistema");
    window.localStorage.removeItem("empresa");
    window.localStorage.removeItem("cliente");
    window.localStorage.removeItem("nombre");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("foto_user");
    this.router.navigateByUrl("login");
  }
}
