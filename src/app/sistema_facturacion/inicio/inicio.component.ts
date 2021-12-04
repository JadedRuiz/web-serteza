import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { FacturacionService } from 'src/app/services/Facturacion/Facturacion.service';
import { SucursalService } from 'src/app/services/Sucursal/sucursal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  url_foto = "./assets/iconos/perfil.svg";
  foto_empresa = "./assets/img/defaults/imagen-empresa-default.png";
  id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  nombre = window.sessionStorage.getItem("nombre");
  modal: any;
  public filterControl = new FormControl();
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public clientes : any;
  filtros = {
    id_empresa : 0,
    id_sucursal : 0,
    rfc : "",
    fecha_inicial : "",
    fecha_final : "",
    fecha_pago_i : "",
    fecha_pago_f : "",
    tipo_nomina : "",
    periodo : "",
    ejercicio : ""
  }
  displayedColumns: string[] = ['codigo', 'nombre', 'rfc', "uuid", 'fecha_pago', 'fecha_timbrado', 'accion'];
  dataSource  : any[] = [];
  registros = 0;
  empresas : any;
  empresas_copy : any;
  busqueda : any;
  sucursal = true;
  sucursales : any;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  id_timbrado = 0;
  correo = "";
  descarga_masiva = false;

  constructor(
    private router: Router,
    private cliente_service : ClienteService,
    private modalService: NgbModal,
    private factura_service : FacturacionService,
    private empresa_service  : EmpresaService,
    private sucursal_service : SucursalService,
    private dateAdapter: DateAdapter<Date>
  ) { 
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.url_foto = window.sessionStorage["foto"];
    this.mostrarLogo();
    this.obtenerFacturas();
    this.obtenerEmpresas();
  }

  obtenerFacturas(){
    this.dataSource = [];
    let json = {
      id_cliente : this.id_cliente,
      filtros : this.filtros
    };
    this.factura_service.obtenerFacturas(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.dataSource = object.data.repuesta;
        this.registros = object.data.total;
        this.descarga_masiva = true;
      }else{
        this.descarga_masiva = false;
      }
    });
  }

  obtenerEmpresas(){
    this.empresas = [];
    this.empresa_service.obtenerEmpresasPorIdCliente(this.id_cliente)
    .subscribe((object : any) => {
      if(object.ok){
        this.empresas = object.data;
        this.empresas_copy = object.data;
      }
    });
  }

  searchEmpresa(){
    this.empresas_copy = [];
    this.empresas.forEach((element : any) => {
      this.empresas_copy.push({
        "empresa" : element.empresa,
        "id_empresa" : element.id_empresa
      });
    });
    if(this.busqueda.length > 0){
      this.empresas_copy = [];
      this.empresas.forEach((element : any) => {
        if(element.empresa.includes(this.busqueda.toUpperCase())){ 
          this.empresas_copy.push({
            "empresa" : element.empresa,
            "id_empresa" : element.id_empresa
          })
        }
      });
    }
  }

  selectEmpresa(event : any){
    console.log(event.option);
    this.filtros.id_empresa = event.option.id;
    this.sucursales = [];
    this.sucursal_service.obtenerSucursales(this.filtros.id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.sucursales = object.data;
        this.sucursal = false;
      }
    });
  }

  buscar(){
    this.obtenerFacturas();
  }

  mostrarLogo(){
    if(window.sessionStorage.getItem("cliente") != null){
      this.cliente_service.obtenerClientesPorId(this.id_cliente)
      .subscribe( (object : any) => {
        if(object.ok){
          this.foto_empresa = ""+object.data[0].fotografia+"";
        }
      });
    }else{
      this.foto_empresa = "./assets/img/defaults/imagen-empresa-default.png";
    }
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop', backdrop: 'static', keyboard: false});
  }

  cerrarModal(){
    this.modal.close();
  }
  
  limpiarCampos(){
    this.filtros = {
      id_empresa : 0,
      id_sucursal : 0,
      rfc : "",
      fecha_inicial : "",
      fecha_final : "",
      fecha_pago_i : "",
      fecha_pago_f : "",
      tipo_nomina : "",
      periodo : "",
      ejercicio : ""
    }
    this.id_timbrado = 0;
    this.correo = "";
    this.busqueda = "";
    this.obtenerFacturas();
  }

  opcion(tipo : number, id : number){
    let json = {};
    if(tipo == 1){
      json = {
        id_timbrado : id,
        tipo : tipo
      };
      this.factura_service.opcionesFactura(json)
      .subscribe((object : any) => {
        if(object.ok){
          var arrayBuffer = this.base64ToArrayBuffer(object.data.xml);
          var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
          var data = window.URL.createObjectURL(newBlob);
          let link  = document.createElement('a');
          link.href = data;
          link.download = object.data.uuid+".xml";
          link.click();
        }
      });
    }
    if(tipo == 2){
      json = {
        id_timbrado : id,
        tipo : tipo
      }
      this.factura_service.opcionesFactura(json)
      .subscribe((object : any) => {
        if(object.ok){
          let win = window.open(object.data.uuid,"_blank");
          let html = '';
          html += '<html>';
          html += '<body style="margin:0!important">';
          html += '<embed width="100%" height="100%" src="data:application/pdf;base64,'+object.data.xml+'" type="application/pdf" />';
          html += '</body>';
          html += '</html>';
          win?.document.write(html);
        }
      });
    }
    if(tipo == 3){
      this.openModal();
      this.id_timbrado = id;
    }
  }

  enviarCorreo(){
    let json = {
      id_timbrado : this.id_timbrado,
      tipo : 3,
      correo : this.correo
    };
    if(!this.emailFormControl.invalid && this.correo !== ''){
      this.factura_service.opcionesFactura(json)
      .subscribe((object : any) => {
        if(object.ok){
          Swal.fire("Buen trabajo","El correo ha sido enviado con exito","success");
          this.cerrarModal();
        }
      });
    }
    
  }

  descargaMasiva(){
    let json = {
      id_cliente : this.id_cliente,
      filtros : this.filtros
    };
    this.factura_service.descargaMasiva(json)
    .subscribe((object : any) => {
      if(!object.ok){
        Swal.fire("Ha ocurrido un error","No se ha encontrado resultados","error");
      }
    });
  }

  base64ToArrayBuffer(base64 : string) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
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
        window.sessionStorage.removeItem("sistema");
        window.sessionStorage.removeItem("cliente");
        window.sessionStorage.removeItem("nombre");
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("foto_user");
        this.router.navigateByUrl("login");
      }
    });
  }
}
