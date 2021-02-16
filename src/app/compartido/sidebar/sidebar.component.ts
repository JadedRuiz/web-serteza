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
  public isCollapsed = true;
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.pintarMenu();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
  pintarMenu(){
    console.log(window.localStorage.getItem("sistema"));
    if(window.sessionStorage.getItem("sistema") == "1"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary'},
        { path: '/recursos_humanos', title: 'Catálogo de empleados',  icon:'ni-circle-08 text-orange'}
      ];
    }
    if(localStorage.getItem('sistema') == "2"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary'},
        { path: '/recursos_humanos', title: 'Catálogo de empleados',  icon:'ni-circle-08 text-orange'}
      ];
    }
    if(localStorage.getItem('sistema') == "3"){
      this.menuItems = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary'},
        { path: '/recursos_humanos', title: 'Catálogo de empleados',  icon:'ni-circle-08 text-orange'}
      ];
    }
  }
}
