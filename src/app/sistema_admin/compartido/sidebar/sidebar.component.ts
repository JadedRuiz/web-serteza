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
  selector: 'app-sidebar',
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

  constructor(
    private router: Router,
    public usuario: UsuarioService,
    public empresa: EmpresaService,
    private sanitizer: DomSanitizer,
    private cliente_service : ClienteService,
    private modalService: NgbModal
    ) {}

  ngOnInit() {
    this.pintarMenu();
    // this.validarClientes();
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
          {path: 'catalogo_usuario', title: 'Mis usuarios', icon: 'ni-circle-08  text-orange'},
          {path: 'catalogo_empresa', title: 'Mis empresas', icon: 'ni-building  text-orange'},
          {path: 'catalogo_cliente', title: 'Mis clientes', icon: 'ni-collection  text-orange'}
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
  validarClientes(){
    //AQUI SE RECUPERAN LOS CLIENTES DEL USUARIO LOGUEADO
    this.clientes = [];
    if(window.sessionStorage.getItem("cliente") == null){
      let id_sistema_usuario = window.sessionStorage.getItem("sistema");
      this.cliente_service.obtenerClientes(parseInt(id_sistema_usuario+""))
      .subscribe( (object : any) => {
        console.log(object);
        if(object.ok){
          if(object.data.length > 1){
            this.clientes.push(object.data);
            this.openModal();
          }else{
            if(object.data[0].empresa_relacionada_id != ""){
              window.sessionStorage["empresa"] = object.data[0].empresa_relacionada_id;
              window.sessionStorage["foto_empresa"] = object.data[0].fografia_empresa_id;
              this.mostrarLogo();
            }
            window.sessionStorage["cliente"] = object.data[0].id;
          }
        }
      });
    }
  }
  eleccion(id_cliente : any, id_empresa : any, id_fotografia : any){
    if(id_empresa =! ""){
      window.sessionStorage["empresa"] = id_empresa;
      window.sessionStorage["foto_empresa"] = id_fotografia;
      this.mostrarLogo();
    }
    window.sessionStorage["cliente"] = id_cliente;
    this.closeModal();
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
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
}
