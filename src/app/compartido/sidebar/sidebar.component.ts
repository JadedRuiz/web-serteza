import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.pintarMenu();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
  pintarMenu(){
    //Sistema de Recursos Humanos
    if(window.sessionStorage.getItem("sistema") == "1"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', id:"dashboard_header"},
        { path: '/recursos_humanos', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header"}
      ];
      this.subMenuItems = [
        {
          id: 'dashboarb_header',
          submenu : []
        },
        { 
          id: 'rh_header', 
          submenu : [
            {path: '/catalogo_candidato', title: 'Cátalogo de candidatos', icon: 'ni-badge text-orange'},
            {path: '/catalogo_cliente', title: 'Cátalogo de clientes', icon: 'ni-circle-08 text-orange'}
          ]
        },
      ]
    }
    //Sistema de Nómina
    if(localStorage.getItem('sistema') == "2"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary'},
        { path: '/recursos_humanos', title: 'Catálogo de empleados',  icon:'ni-circle-08 text-orange'}
      ];
    }
    //Sistema de Control de asistencia
    if(localStorage.getItem('sistema') == "3"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary'},
        { path: '/recursos_humanos', title: 'Catálogo de empleados',  icon:'ni-circle-08 text-orange'}
      ];
    }
  }
}
