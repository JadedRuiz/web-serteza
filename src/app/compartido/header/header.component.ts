import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/Empleado/empleado.service';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado';
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
  keyword = 'nombre';
  data = new Array;
  constructor(private router: Router,
    public empleado: EmpleadoService,
    public usuario: UsuarioService) {
      this.getEmpleadoService();
     }

  ngOnInit(): void {
  }
  getEmpleadoService(){
    let empleados = this.empleado.getEmpleados();
    for(let i=0;i<empleados.length;i++){
      this.data.push({
        "nombre" : empleados[i].nombre,
        "id" : empleados[i].numero_empleado
      });
    }
  }
  autocomplete(event: any){
    if(this.router.url.toString().includes("recursos_humanos")){
      let empleados = this.empleado.getEmpleados();
      //console.log(event.target.value);
      //console.log(empleados);
    }
    
  }
  selectEvent(event : any){
    // location.href = "recursos_humanos/"+event.id;
    this.router.navigateByUrl("recursos_humanos/"+event.id);
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
