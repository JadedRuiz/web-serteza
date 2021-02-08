import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { User }  from 'src/app/models/user'
import { EmpleadoService} from 'src/app/services/Empleado/empleado.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public color = COLOR;
  usuario: User = new User("","");

  constructor( 
    public empleadoService : EmpleadoService,
    private router : Router
    ) { }

  ngOnInit(): void {
  }
  public login(f : NgForm){
    if(f.invalid){
      return ;
    }else{
      if(this.empleadoService.login(this.usuario.usuario,this.usuario.password)){
        Swal.fire("Buen trabajo","Sus credenciales son validas","success");
        this.router.navigate(["dashboard"]);
      }else{
        Swal.fire("Ha ocurrido un error","Sus credenciales no son validas","error");
      }
    }
  }
}
