import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/Empleado/empleado.service';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  keyword = 'nombre';
  data = new Array;
  constructor(private router: Router,
    public empleado: EmpleadoService) {
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
    this.empleado.logout();
    this.router.navigateByUrl("login");
  }
}
