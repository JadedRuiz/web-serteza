import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';

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
  public url_foto : any;

  public menuItems = Array();
  public subMenuItems = Array();
  public isCollapsed = true;
  public foto_empresa : any //
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");

  constructor(
    private router: Router,
    public usuario: UsuarioService,
    private empresa: EmpresaService,
    private modalService: NgbModal
    ) {
      this.foto_empresa = "./assets/img/defaults/imagen-no-disponible.png";
      this.url_foto = './assets/iconos/perfil.svg';
    }

  ngOnInit() {
    this.pintarMenu();
    this.mostrarLogo();
    // this.validarClientes();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
   this.url_foto = window.sessionStorage["foto"];
  }
  pintarMenu(){
    this.menuItems = [
      { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
      { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
        submenu : [
          {path: 'catalogo_empleado', title: 'Mis empleados', icon: 'ni-circle-08 text-orange'},

        ]
      },
      { path: '#', title: 'Procedimientos', icon: 'ni-app text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
        submenu : [
          {path: 'procedimiento_solicitudes', title: 'Aplicar solicitudes de Recursos Humanos', icon: 'ni-button-play text-yellow'},
        ]
      },
      { path: '#', title: 'Herramientas', icon: 'ni-settings text-purple', id:'rh_herramientas', band: true, tipo : "collapse",
        submenu : [
          {path: 'procedimiento_contratacion', title: 'Exportar movimientos IDSE/SUA', icon: 'ni-bold-up text-purple'},
        ]
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: true, tipo : "collapse",
        submenu : [
          {path: 'reporte_general', title: 'Reporte de nómina', icon: 'ni-book-bookmark text-green'},
        ]
    }
    ];
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
  eleccion(id_cliente : any){
    window.sessionStorage["cliente"] = id_cliente;
    this.closeModal();
    this.mostrarLogo();
  }
  cerrarSesion(){
    Swal.fire({
      title: '¿Estas que deseas cerrar sesión?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuario.logout();
        window.sessionStorage.removeItem("sistema");
        window.sessionStorage.removeItem("empresa");
        window.sessionStorage.removeItem("nombre");
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("foto_user");
        this.router.navigateByUrl("login");
      }
    });
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
}
