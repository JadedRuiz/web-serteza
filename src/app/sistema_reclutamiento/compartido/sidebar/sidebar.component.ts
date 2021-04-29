import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
@Component({
  selector: 'app-sidebar-rc',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public clientes : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal: any;

  public menuItems = Array();
  public subMenuItems = Array();
  public isCollapsed = true;
  public foto_empresa : any //
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");

  constructor(
    private router: Router,
    public usuario: UsuarioService,
    public empresa: EmpresaService,
    private sanitizer: DomSanitizer,
    private cliente_service : ClienteService,
    private modalService: NgbModal
    ) {
      this.foto_empresa = "./assets/img/defaults/imagen-no-disponible.png";
    }

  ngOnInit() {
    this.pintarMenu();
    this.validarClientes();
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
    this.menuItems = [
      { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
      { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
        submenu : [
          {path: 'catalogo_candidato', title: 'Mis candidatos', icon: 'ni-badge text-orange'},
        ]
      },
      { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
        submenu : [
          {path: 'catalogo_candidato', title: 'Solicitudes de contratación', icon: 'ni-folder-17 text-yellow'},
        ]
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: false, tipo : ""}
    ];
  }
  validarClientes(){
    //AQUI SE RECUPERAN LOS CLIENTES DEL USUARIO LOGUEADO
    this.clientes = [];
    if(window.sessionStorage.getItem("cliente") == null){
      this.cliente_service.obtenerClientePorIdUsuario(this.usuario_logueado)
      .subscribe( (object : any) => {
        if(object.ok){
          if(object.data.length > 1){
            this.clientes.push(object.data);
            this.openModal();
          }else{
            window.sessionStorage["cliente"] = object.data[0].id;
          }
        }
      });
    }
  }
  eleccion(id_cliente : any){
    window.sessionStorage["cliente"] = id_cliente;
    this.closeModal();
  }
  cerrarSesion(){
    this.usuario.logout();
    window.sessionStorage.removeItem("sistema");
    window.sessionStorage.removeItem("empresa");
    window.sessionStorage.removeItem("cliente");
    window.sessionStorage.removeItem("nombre");
    window.sessionStorage.removeItem("user");
    window.sessionStorage.removeItem("foto_user");
    this.router.navigateByUrl("login");
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
}
