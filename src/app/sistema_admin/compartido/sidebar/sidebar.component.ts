import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  public empresas : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal: any;

  public menuItems = Array();
  public subMenuItems = Array();
  public isCollapsed = true;
  public foto_empresa : any //
  public foto_user : any;
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");

  constructor(
    private router: Router,
    public usuario: UsuarioService,
    public empresa: EmpresaService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
    ) {
      this.foto_empresa = "./assets/img/defaults/imagen-empresa-default.png";
      this.foto_user = "./assets/img/defaults/ico_default_admin.jpg";
    }

  ngOnInit() {
    this.pintarMenu();
    // this.validarEmpresa();
    this.mostrarLogo();
    this.foto_user = window.sessionStorage["foto"];
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
  mostrarLogo(){
    if(window.sessionStorage.getItem("empresa") != null){
      let id_empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
      this.empresa.obtenerEmpresaPorId(id_empresa)
      .subscribe( (object : any) => {
        if(object.ok){
          this.foto_empresa = ""+object.data[0].fotografia;
        }
      });
    }else{
      this.foto_empresa = "./assets/img/defaults/imagen-empresa-default.png";
    }
  }
  pintarMenu(){
    this.menuItems = [
      { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
      { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
        submenu : [
          {path: 'catalogo_usuario', title: 'Mis usuarios', icon: 'ni-circle-08  text-orange'},
          {path: 'catalogo_departamento', title: 'Mis departamentos', icon: 'ni-archive-2  text-orange'}
        ]
      },
      { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
        submenu : [
          {path: 'procedimiento_usuario', title: 'Asignar permisos a usuario', icon: 'ni-badge text-yellow'}
        ]
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: false, tipo : ""}
    ];
  }
  validarEmpresa(){
    //AQUI SE RECUPERAN LOS CLIENTES DEL USUARIO LOGUEADO
    this.empresas = [];
    if(window.sessionStorage.getItem("empresa") == null){
      this.empresa.obtenerEmpresaPorIdUsuario(this.usuario_logueado)
      .subscribe( (object : any) => {
        if(object.ok){
          if(object.data.length > 1){
            this.empresas.push(object.data);
            this.openModal();
          }else{
            window.sessionStorage["empresa"] = object.data[0].id_empresa;
            this.mostrarLogo();
          }
        }
      });
    }else{
      this.mostrarLogo();
    }
  }
  eleccion(id_empresa : any){
    window.sessionStorage["empresa"] = id_empresa;
    this.mostrarLogo();
    this.closeModal();
  }
  cerrarSesion(){
    this.usuario.logout();
    window.sessionStorage.removeItem("sistema");
    window.sessionStorage.removeItem("empresa");
    window.sessionStorage.removeItem("cliente");
    window.sessionStorage.removeItem("nombre");
    window.sessionStorage.removeItem("user");
    window.sessionStorage.removeItem("foto");
    this.router.navigateByUrl("login");
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
}
