import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { DomSanitizer } from '@angular/platform-browser';
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public menuItems = Array();
  public subMenuItems = Array();
  public isCollapsed = true;
  public foto_empresa : any //

  constructor(
    private router: Router,
    public usuario: UsuarioService,
    public empresa: EmpresaService,
    private sanitizer: DomSanitizer
    ) {}

  ngOnInit() {
    this.mostrarLogo();
    this.pintarMenu();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
  mostrarLogo(){
    let id_empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
    this.empresa.obtenerEmpresaPorId(id_empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        let base64 = "data:image/"+object.data.extension+";base64, "+object.data.fotografia;
        this.foto_empresa = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
      }
    });
  }
  pintarMenu(){
    //Sistema del Administrador
    if(window.sessionStorage.getItem("sistema") == "4"){
      this.menuItems = [
        // { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
        { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
          submenu : [
            // {path: '/catalogo_candidato', title: 'Mis candidatos', icon: 'ni-badge text-orange'},
            {path: '/catalogo_empresa', title: "Mis empresas", icon: 'ni-building text-orange'},
            {path: '/catalogo_cliente', title: 'Mis clientes', icon: 'ni-circle-08 text-orange'}
          ]
        },
        { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
          submenu : [
            {path: '/catalogo_candidato', title: 'Asignar permisos a usuario', icon: 'ni-badge text-yellow'},
          ]
        },
        { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: false, tipo : ""}
      ];
    }
    //Sistema de Recursos Humanos
    if(window.sessionStorage.getItem("sistema") == "1"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
        { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
          submenu : [
            {path: '/catalogo_candidato', title: 'Mis candidatos', icon: 'ni-badge text-orange'},
            {path: '/catalogo_empresa', title: "Mis empresas", icon: 'ni-building text-orange'},
            {path: '/catalogo_cliente', title: 'Mis clientes', icon: 'ni-circle-08 text-orange'}
          ]
        },
        { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
          submenu : [
            {path: '/catalogo_candidato', title: 'Asignar permisos a usuario', icon: 'ni-badge text-yellow'},
          ]
        },
        { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: false, tipo : ""}
      ];
    }
    //Sistema de Nómina
    if(localStorage.getItem('sistema') == "2"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
        { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
          submenu : [
            {path: '/catalogo_candidato', title: 'Mis candidatos', icon: 'ni-badge text-orange'},
            {path: '/catalogo_empresa', title: "Mis empresas", icon: 'ni-building text-orange'},
            {path: '/catalogo_cliente', title: 'Mis clientes', icon: 'ni-circle-08 text-orange'}
          ]
        },
        { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
          submenu : [
            
          ]
        },
        { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: false, tipo : ""}
      ];
    }
    //Sistema de Control de asistencia
    if(localStorage.getItem('sistema') == "3"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
        { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
          submenu : [
            {path: '/catalogo_candidato', title: 'Mis candidatos', icon: 'ni-badge text-orange'},
            {path: '/catalogo_empresa', title: "Mis empresas", icon: 'ni-building text-orange'},
            {path: '/catalogo_cliente', title: 'Mis clientes', icon: 'ni-circle-08 text-orange'}
          ]
        },
        { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
          submenu : [
            
          ]
        },
        { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: false, tipo : ""}
      ];
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
