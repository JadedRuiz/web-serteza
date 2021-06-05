import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
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
    private sanitizer: DomSanitizer,
    private cliente_service : ClienteService,
    private modalService: NgbModal
    ) {
      this.foto_empresa = "./assets/img/defaults/imagen-no-disponible.png";
    }

  ngOnInit() {
    this.pintarMenu();
    this.validarClientes();
    this.mostrarLogo();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
  pintarMenu(){
    this.menuItems = [
      { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
      { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
        submenu : [
          {path: 'catalogo_candidato', title: 'Mis candidatos', icon: 'ni-badge text-orange'},
        ]
      },
      { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
        submenu : [
          {path: 'procedimiento_contratacion', title: 'Nueva contratación', icon: 'ni-folder-17 text-yellow'},
          {path: 'procedimiento_baja', title: 'Bajas', icon: 'ni-fat-remove text-yellow'},
          {path: 'procedimiento_modificacion', title: 'Modificaciónes', icon: 'ni-curved-next text-yellow'},
        ]
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: true, tipo : "collapse",
        submenu : [
          {path: 'reporte_general', title: 'Reporte General', icon: 'ni-archive-2 text-green'},
        ]
    }
    ];
  }
  mostrarLogo(){
    if(window.sessionStorage.getItem("cliente") != null){
      let id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
      this.cliente_service.obtenerClientesPorId(id_cliente)
      .subscribe( (object : any) => {
        if(object.ok){
          this.foto_empresa = ""+object.data[0].fotografia;
        }
      });
    }else{
      this.foto_empresa = "./assets/img/defaults/imagen-empresa-default.png";
    }
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
            window.sessionStorage["cliente"] = object.data[0].id_cliente;
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
