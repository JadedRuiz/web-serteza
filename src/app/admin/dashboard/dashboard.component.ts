import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import swal from'sweetalert2';
import { EmpleadoService } from 'src/app/services/Empleado/empleado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public color = COLOR;
  constructor(public empleado : EmpleadoService, private router : Router) { }
  
  ngOnInit(): void {
    if(this.empleado.obtenerToken() == ""){
      this.router.navigateByUrl("/login");
    }
  }
}
