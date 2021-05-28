import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre = window.sessionStorage.getItem("nombre");
  public url_foto = window.sessionStorage.getItem("foto_user");
  public texto : String;
  constructor(private router: Router,
    ) {
      this.texto = "SISTEMA ADMINISTRATIVO GENERAL";
     }

  ngOnInit(): void {
  }

  cerrarSesion(){
    window.localStorage.removeItem("sistema");
    window.localStorage.removeItem("empresa");
    window.localStorage.removeItem("cliente");
    window.localStorage.removeItem("nombre");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("foto_user");
    this.router.navigateByUrl("login");
  }
}
