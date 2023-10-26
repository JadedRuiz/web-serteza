import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  id: any;
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
  public perfil = parseInt(window.sessionStorage.getItem("perfil")+"");

  constructor(
    private router: Router,
    public usuario: UsuarioService,
    private sanitizer: DomSanitizer,
    private cliente_service : ClienteService,
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
    let catalogos = [];
    let procesos = [];
    let asistencias = [];

    //Perfiles
    //Administrador
    if(this.perfil == 1){
      catalogos.push(
        {path: 'catalogo_empresa', title: 'Empresas', icon: 'far fa-building'},
        {path: 'catalogo_sucursal', title: 'Sucursales', icon: 'fa fa-bookmark'},
        {path: 'catalogo_departamento', title: 'Departamentos', icon: 'ni-archive-2'},
        {path: 'usuarios', title: 'Usuarios', icon: 'ni-circle-08'},
        {path: 'catalogo_turnos', title: 'Turnos', icon: 'fa fa-users'},
        {path: 'catalogo_festivos', title: 'Festivos', icon: 'fa fa-bookmark'},
        {path: 'puntos_Acceso', title: 'Puntos de acceso', icon: 'ni  ni-time-alarm'},
        );
        procesos.push(
          {path: 'catalogo_candidato', title: 'Candidatos', icon: 'ni-badge'},
         {path: 'procedimiento_contratacion', title: 'Contrataciones', icon: 'ni-folder-17'},
         {path: 'procedimiento_modificacion', title: 'Modificaciones', icon: 'ni-curved-next'},
         {path: 'procedimiento_baja', title: 'Bajas', icon: 'ni-fat-remove'},
         );
         asistencias.push(
         {path: 'bitacora-insidencias', title: 'Bitacora', icon: 'fa fa-calendar-check'},
         {path: 'asignar_turno', title: 'Asignar turnos', icon: 'fa fa-id-badge'},
         {path: 'proced_vacaciones', title: 'Vacaciones', icon: 'ni-calendar-grid-58'},
         {path: 'proced_incapacidades', title: 'Incapacidades', icon: 'fa fa-medkit'},
         {path: 'calcular_incidencia', title: 'Calcular Incidencias', icon: 'ni-archive-2 text-white'},
         {path: 'proced_xml', title: 'Recibos', icon: 'ni ni-single-copy-04'},
         {path: 'asistencia', title: 'Asistencia',  icon: 'fa fa-check-square'},
        //  {path: 'user', title: 'Usuarios', icon: 'fa fa-users'},
         {path: 'aut_justificaciones', title: 'Justificaciones', icon: 'fa fa-file-archive'},
    );
    }
    //JEFE INMEDIATO
    if(this.perfil == 2){
      catalogos.push(
        {path: 'catalogo_candidato', title: 'Candidatos', icon: 'ni-badge'}
      );
    }
    //RECURSOS HUMANOS
    if(this.perfil == 3){
      catalogos.push(
        {path: 'catalogo_empresa', title: 'Empresas', icon: 'far fa-building'},
        {path: 'catalogo_sucursal', title: 'Sucursales', icon: 'fa fa-bookmark'},
        {path: 'catalogo_departamento', title: 'Departamentos', icon: 'ni-archive-2'},
        {path: 'usuarios', title: 'Usuarios', icon: 'ni-circle-08'},
        {path: 'catalogo_turnos', title: 'Turnos', icon: 'fa fa-users'},
        {path: 'catalogo_festivos', title: 'Festivos', icon: 'fa fa-bookmark'},
        {path: 'puntos_Acceso', title: 'Puntos de acceso', icon: 'ni  ni-time-alarm'},
        );
        procesos.push(
          {path: 'catalogo_candidato', title: 'Candidatos', icon: 'ni-badge'},
         {path: 'procedimiento_contratacion', title: 'Contrataciones', icon: 'ni-folder-17'},
         {path: 'procedimiento_modificacion', title: 'Modificaciones', icon: 'ni-curved-next'},
         {path: 'procedimiento_baja', title: 'Bajas', icon: 'ni-fat-remove'},
         );
         asistencias.push(
         {path: 'bitacora-insidencias', title: 'Bitacora', icon: 'fa fa-calendar-check'},
         {path: 'asignar_turno', title: 'Asignar turnos', icon: 'fa fa-id-badge'},
         {path: 'proced_vacaciones', title: 'Vacaciones', icon: 'ni-calendar-grid-58'},
         {path: 'proced_incapacidades', title: 'Incapacidades', icon: 'fa fa-medkit'},
         {path: 'calcular_incidencia', title: 'Calcular Incidencias', icon: 'ni-archive-2 text-white'},
         {path: 'proced_xml', title: 'Recibos', icon: 'ni ni-single-copy-04'},
         {path: 'asistencia', title: 'Asistencia',  icon: 'fa fa-check-square'},
        //  {path: 'user', title: 'Usuarios', icon: 'fa fa-users'},
         {path: 'aut_justificaciones', title: 'Justificaciones', icon: 'fa fa-file-archive'},
    );
    }
    //EMPLEADO
    if(this.perfil == 7){
      this.menuItems = [
         { path: 'asistencia', title: 'Asistencia',  icon: 'fa fa-id-badge text-green', id:"asistencia_header", band: false, tipo : "", bg : "red"},
         { path: 'proced_xml', title: 'Recibos',  icon: 'ni-archive-2 text-green', id:"asistencia_header", band: false, tipo : "", bg : "red"},
         { path: 'bitacora-insidencias', title: 'Bitacora',  icon: 'ni-calendar-grid-58 text-green', id:"asistencia_header", band: false, tipo : "", bg : "red"},
        ];
      // catalogos.push(
      // );
      // procesos.push(
      //   {path: 'proced_vacaciones', title: 'Vacaciones', icon: 'ni-calendar-grid-58'}
      // );
    } else {

    this.menuItems = [

      { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-yellow', id:"dashboard_header", band: false, tipo : "", bg : "red"},
        // { path: 'asistencia', title: 'Asistencia',  icon: 'fa fa-users text-green', id:"asistencia_header", band: false, tipo : "", bg : "red"},
      { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
        submenu : catalogos, bg : "orange"
      },
      { path: '#', title: 'Empleados', icon: 'fa fa-users text-red', id:'rh_procesos', band: true, tipo : "collapse",
        submenu : procesos, bg : "red"
      },
      { path: '#', title: 'Control asistencias', icon: 'ni-calendar-grid-58 text-blue', id:'asistencias', band: true, tipo : "collapse",
        submenu : asistencias, bg : "blue"
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: true, tipo : "collapse",
        submenu : [
          {path: 'reporte_general', title: 'Reporte General', icon: 'ni-archive-2 text-white'},
          {path: 'reporte_incidencia', title: 'Reporte Incidencias', icon: 'ni-archive-2 text-white'},
        ], bg : "green"
    }
    ];
  }

  }
  mostrarLogo(){
    if(window.sessionStorage.getItem("cliente") != null){
      let id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
      this.cliente_service.obtenerClientesPorId(id_cliente)
      .subscribe( (object : any) => {
        if(object.ok){
          this.foto_empresa = ""+object.data[0].fotografia+"";
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
            this.mostrarLogo();
          }
        }
      });
    }else{
      this.mostrarLogo();
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
        window.sessionStorage.removeItem("cliente");
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


  elementoAbierto = false; // Variable para el elemento actualmente abierto

  abrirElemento() {
    if(!this.elementoAbierto == true){
      this.elementoAbierto = false;
    }else{

    }

  }




}
