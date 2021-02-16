import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import swal from'sweetalert2';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public color = COLOR;
  constructor(public usuario : UsuarioService, private router : Router) { }
  
  ngOnInit(): void {
    // if(this.usuario.obtenerToken() == ""){
    //   this.router.navigateByUrl("/login");
    // }
  }
}
