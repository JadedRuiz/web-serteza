import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
  public foto_empresa : any; //

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
          { path: '#', title: 'Cliente / Proveedor',  icon:'ni-satisfied text-orange', id:"rh_header", band: true, tipo : "collapse"},
          { path: 'catalogo_empresa', title: 'Empresas', icon: 'fas fa-home text-orange'},
           //{ path: '#', title: 'Ivas',  icon:'ni-money-coins text-orange', id:"rh_header", band: true, tipo : "collapse"},
          { path: 'conceptos', title: 'Conceptos',  icon:'ni-books text-orange', id:"rh_header", band: true, tipo : "collapse"},
        //{ path: 'bancos', title: 'Bancos',  icon:'ni-building text-orange', id:"rh_header", band: true, tipo : "collapse"}
        ]
      },
      { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
        submenu : [
          { path: 'mov-banco', title: 'Movimiento de bancos',  icon:'fas fa-university text-yellow', id:"rh_header", band: true, tipo : "collapse"},
          { path: 'facturas', title: 'Captura facturas',  icon:'ni-folder-17 text-yellow', id:"rh_header", band: true, tipo : "collapse"},
          { path: 'descarga-masiva', title: 'Descarga masiva',  icon:'ni-cloud-download-95 text-yellow', id:"rh_header", band: true, tipo : "collapse"},
          { path: 'calcular', title: 'Calcular',  icon:'ni-folder-17 text-yellow', id:"rh_header", band: true, tipo : "collapse"},
          { path: 'revisar', title: 'Revisar XML',  icon:'ni-books text-yellow', id:"rh_header", band: true, tipo : "collapse"},

          // { path: '#', title: 'Captura pagos',  icon:'ni-collection text-yellow', id:"rh_header", band: true, tipo : "collapse"},
          // { path: 'xml-upload', title: 'Carga xml´s',  icon:'ni-cloud-upload-96 text-yellow', id:"rh_header", band: true, tipo : "collapse"},
          // { path: '#', title: 'Estado de cuenta',  icon:'ni-book-bookmark text-yellow', id:"rh_header", band: true, tipo : "collapse"}
        ]
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: true, tipo : "collapse",
      submenu : [
        { path: 'acumulados-nomina', title: 'Acumulados de nomina', icon: 'fas fa-university text-green', id:'rh_reportes', band: true, tipo : "collapse"}
      ]
      },
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
}
