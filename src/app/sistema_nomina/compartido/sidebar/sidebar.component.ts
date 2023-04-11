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
      { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-yellow', id:"dashboard_sidebar", band: false, tipo : "", bg : "red"},
      { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"catalogo_sidebar", band: true, tipo : "collapse",
        submenu : [
          {path: 'catalogo_empleado', title: 'Mis empleados', icon: 'ni-circle-08 text-white'},
          {path: 'catalogo_concepto', title: 'Mis conceptos', icon: 'ni-box-2 text-white'},
          {path: 'catalogo_periodo', title: 'Mis periodos', icon: 'ni-calendar-grid-58 text-white'},
          {path: 'catalogo_departamento', title: 'Mis departamentos', icon: 'ni-archive-2 text-white'},
          {path: 'catalogo_sucursal', title: 'Mis sucursales', icon: 'ni-building text-white'},
          {path: 'catalogo_prestacion', title: 'Mis prestaciones', icon: 'ni-money-coins text-white'},
          {path: 'catalogo_cuenta_bancaria', title: 'Mis cuentas bancarias', icon: 'ni-world-2 text-white'},
          {path: 'catalogo_registro_patronal', title: 'Mis registros patronales', icon: 'ni-paper-diploma text-white'}

        ],
        bg : "orange"
      },
      { path: '#', title: 'Procedimientos', icon: 'ni-app text-red', id:'procesos_sidebar', band: true, tipo : "collapse",
        submenu : [
          {path: 'procedimiento_solicitudes', title: 'Aplicar solicitudes de Recursos Humanos', icon: 'ni-button-play text-white'},
          {path: 'procedimiento_captura', title: 'Captura de incidencias', icon: 'ni-ruler-pencil text-white'},
          {path: 'procedimiento_calculo', title: 'Calculo de nómina', icon: 'ni-active-40 text-white'},
          {path: 'procedimiento_cotizacion', title: 'Cotizar', icon: 'fas fa-calculator text-white'},
          {path: 'procedimiento_cierre', title: 'Cierre de nómina', icon: 'ni-fat-remove text-white'},
        ],
        bg : "red"
      },
      { path: '#', title: 'Herramientas', icon: 'ni-settings text-purple', id:'herramientas_sidebar', band: true, tipo : "collapse",
        submenu : [
          {path: 'procedimiento_contratacion', title: 'Exportar movimientos IDSE/SUA', icon: 'ni-bold-up text-white'},
          {path: 'procedimiento_modificacion', title: 'Dispersión de bancos', icon: 'ni-shop text-white'},
          {path: 'procedimiento_baja', title: 'Activar empleado', icon: 'ni-key-25 text-white'},
        ],
        bg : "purple"
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'reportes_sidebar', band: true, tipo : "collapse",
        submenu : [
          {path: 'reporte_general', title: 'Reporte de nómina', icon: 'ni-book-bookmark text-white'},
          {path: 'reporte_general', title: 'Cifras de control', icon: 'ni-book-bookmark text-white'},
          {path: 'reporte_general', title: 'Reporte por conceptos', icon: 'ni-book-bookmark text-white'},
          {path: 'reporte_general', title: 'Reporte de recibos timbrados', icon: 'ni-book-bookmark text-white'},
          {path: 'reporte_general', title: 'Acumulados por trabajador', icon: 'ni-book-bookmark text-white'},
        ],
        bg : "green"
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