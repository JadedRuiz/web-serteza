import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { Cliente } from 'src/app/models/Cliente';
import { Direccion } from 'src/app/models/Direccion';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Fotografia } from 'src/app/models/Fotografia';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';

@Component({
  selector: 'app-candidatos',
  templateUrl: './cat_cliente.component.html',
  styleUrls: ['./cat_cliente.component.css']
})
export class CatalogoClienteComponent implements OnInit {
  //Variables globales
  public color = COLOR;
  public direccion : Direccion = new Direccion(0,"","","","","","","","","","","");
  filterControlCliente = new FormControl();
  public clientes : any;
  public clientes_busqueda : any;
  filterControlEstado = new FormControl();
  estados : any;
  estados_busqueda : any;
  public usuario_creacion = window.sessionStorage.getItem("user");
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public foto_user : any;
  public docB64 = "";
  public fotografia = new Fotografia(0,"","","");
  public cliente = new Cliente(0,"","","",0,0,this.direccion,1,this.fotografia);
  //Filtros
  public status = 2; //Status default
  //Modelo tabla
  displayedColumns: string[] = ['Id', 'Cliente', "Estatus", "Accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  tipo_modal = 0;
  
  colonias = [
    "Primero ingresa el Codigo Postal"
  ];

  constructor( 
    private modalService: NgbModal,
    public cp_service: LocalidadService,
    private cliente_service: ClienteService,
    private sanitizer: DomSanitizer,
    private compartido_service : CompartidoService,
  ) {
      this.foto_user = "./assets/img/defaults/imagen-no-disponible.png";
    }

  ngOnInit(): void {
    this.mostrarClientes();
    this.mostrarEstado();
  }

  mostrarClientes(){
    let json = {
      palabra : "",
      taken : 1000,
      status : this.status,
      pagina : 0
    };
    this.clientes = [];
    this.clientes_busqueda = [];
    this.cliente_service.obtenerClientes(json)
    .subscribe( (object : any) =>{
        if(object.ok){
            this.dataSource.data = object.data.registros;
            this.dataSource.paginator = this.paginator;
            this.clientes = object.data.registros;
            this.clientes_busqueda = object.data.registros;
        }else{
          this.dataSource.data = [];
          this.dataSource.paginator = this.paginator;
        }
    });
  }


  buscarCliente(){
    this.clientes_busqueda = [];
    this.clientes.forEach((element : any) => {
      this.clientes_busqueda.push({
        "cliente" : element.cliente,
        "id_cliente" : element.id_cliente
      });
    });
    if(this.filterControlCliente.value.length > 0){
      this.clientes_busqueda = [];
      this.clientes.forEach((element : any) => {
        if(element.cliente.includes(this.filterControlCliente.value.toUpperCase())){ 
          this.clientes_busqueda.push({
            "cliente" : element.cliente,
            "id_cliente" : element.id_cliente
          })
        }
      });
    }
  }

  optionCliente(value : any){
    this.editar(value.option.id);
  }

  mostrarEstado(){
    this.estados_busqueda = [];
    this.estados = [];
    this.compartido_service.obtenerCatalogo("gen_cat_estados")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.estados_busqueda = object;
        this.estados = object;
      }
    });
  }

  buscarEstado(){
    this.estados_busqueda = [];
    this.estados.forEach((element : any) => {
      this.estados_busqueda.push({
        "estado" : element.estado,
        "id_estado" : element.id_estado
      });
    });
    if(this.filterControlEstado.value.length > 0){
      this.estados_busqueda = [];
      this.estados.forEach((element : any) => {
        if(element.estado.includes(this.filterControlEstado.value.toUpperCase())){ 
          this.estados_busqueda.push({
            "estado" : element.estado,
            "id_estado" : element.id_estado
          })
        }
      });
    }
  }

  optionEstado(value : any){
    this.cliente.direccion.estado = value.option.id;
  }

  nuevoCliente(){
    this.tipo_modal == 1;
    this.limpiarCampos();
    this.openModal();
  }

  altaCliente(){
    let band = true;
    if(this.cliente.cliente == "" || this.cliente.contacto == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(
        this.direccion.calle == "" && this.direccion.codigo_postal == "" &&
        this.direccion.colonia == "" && this.direccion.cruzamiento_dos == "" &&
        this.direccion.cruzamiento_uno == "" && this.direccion.descripcion ==  "" &&
        this.direccion.estado == "" && this.direccion.localidad == "" &&
        this.direccion.municipio == "" && this.direccion.numero_exterior == ""
        && this.direccion.numero_interior == ""
        ){
          Swal.fire({
            title: '¿Estas seguro de agregar un cliente sin ningun dato de dirección?',
            text: "El cliente se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro',
            cancelButtonText : "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
              band = true;
            }else{
              band = false;
            }
          });
      }
    }
    if(band){
      this.cliente.usuario_creacion = parseInt(this.usuario_creacion+"");
      this.confirmar("Confirmación","¿Seguro que desea guardar la información?","info",1);
    }
  }
  
  modificarUsuario(){
    let band = true;
    if(this.cliente.cliente == "" || this.cliente.contacto == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(
        this.direccion.calle == "" && this.direccion.codigo_postal == "" &&
        this.direccion.colonia == "" && this.direccion.cruzamiento_dos == "" &&
        this.direccion.cruzamiento_uno == "" && this.direccion.descripcion ==  "" &&
        this.direccion.estado == "" && this.direccion.localidad == "" &&
        this.direccion.municipio == "" && this.direccion.numero_exterior == ""
        && this.direccion.numero_interior == ""
        ){
          Swal.fire({
            title: '¿Estas seguro de agregar un cliente sin ningun dato de dirección?',
            text: "El cliente se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro',
            cancelButtonText : "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
              band = true;
            }else{
              band = false;
            }
          });
      }else{
        if(band){
          this.cliente.usuario_creacion = parseInt(this.usuario_creacion+"");
          this.confirmar("Confirmación","¿Seguro que desea editar la información?","info",2);
        }
      }
    }
  }

  editar(folio : any){
    this.limpiarCampos();
    this.cliente_service.obtenerClientesPorId(folio)
    .subscribe( (object : any) => {
      if(object.ok){
        this.tipo_modal = 2;
        this.openModal();
        //Se llena la informacion en el modal
        this.direccion = new Direccion(
          object.data[0].id_direccion,
          object.data[0].calle,
          object.data[0].numero_exterior,
          object.data[0].numero_interior,
          object.data[0].cruzamiento_uno,
          object.data[0].cruzamiento_dos,
          object.data[0].codigo_postal,
          object.data[0].colonia,
          object.data[0].localidad,
          object.data[0].municipio,
          object.data[0].estado,
          object.data[0].descripcion_direccion
        );
        this.fotografia.id_fotografia = object.data[0].id_fotografia;
        this.cliente = new Cliente(
          object.data[0].id_cliente,
          object.data[0].cliente,
          object.data[0].contacto,
          object.data[0].descripcion,
          0,parseInt(this.usuario_creacion+""),
          this.direccion,
          1,
          this.fotografia
        );
        this.foto_user = object.data[0].fotografia;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }

  limpiarCampos(){
    this.fotografia = new Fotografia(0,"","","");
    this.foto_user = "./assets/img/defaults/imagen-no-disponible.png";
    this.direccion = new Direccion(0,"","","","","","","","","","","");
    this.cliente = new Cliente(0,"","","",0,0,this.direccion,1,this.fotografia);
    this.tipo_modal = 0;
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  subirImagen(){
    document.getElementById("foto_user")?.click();
  }

  convertirImagenAB64(fileInput : any){
    return new Promise(function(resolve, reject) {
      let b64 = "";
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
          b64 = e.target.result.split("base64,")[1];
          resolve(b64);
      };
    });
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      this.fotografia.extension = extension;
      console.log(extension); 
      if(extension == "jpg" || extension == "png" || extension == "jpeg"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.docB64 = respuesta+"";
          this.fotografia.docB64 = respuesta+"";
          this.fotografia.extension = extension;
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }

  mostrarImagen(docB64 : any, extension : any){
    let img = "data:image/"+extension+";base64, "+docB64;
    this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
    this.docB64 = docB64+"";
    this.fotografia.docB64 = docB64;
    this.fotografia.extension = extension;
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number){
    Swal.fire({
      title: title,
      text: texto,
      icon: tipo_alert,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        if(tipo == 1){  //Guardar
          this.cliente_service.altaCliente(this.cliente)
          .subscribe( (object) =>{
            if(object.ok){
              this.limpiarCampos();
              this.mostrarClientes();
              Swal.fire("Buen trabajo","El cliente se ha dado de alta correctamente","success");
              this.cerrarModal();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.cliente_service.actualizarCliente(this.cliente)
          .subscribe( (object) =>{
            if(object.ok){
              this.mostrarClientes();
              Swal.fire("Buen trabajo","El cliente se ha editado correctamente","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    });
  }
}
