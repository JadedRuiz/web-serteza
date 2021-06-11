import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: []
})
export class FacturasComponent implements OnInit {
  myControl = new FormControl();
  clienteProveedorID = 0;
  options: any[] = [];
  miEmpresa = window.sessionStorage["empresa"];
  filteredOptions: Observable<any[]> | undefined;
  periodoDia = false;
  dia = true;
  public taken = 5; //Registros por default
  public total_registros = 0;
  public mostrar_pagination = false;
  public paginas_a_mostrar = 5;
  public paginas : any;
  public pagina_actual = 0;
  public limite_inferior = 0;
  public limite_superior = this.paginas_a_mostrar;
  public next = false;
  public previous = false;
  public band_persiana = true;
  public band = true;


  periodo = false;

  miObjeto: any = {
    id_provcliente: 0,
    id_empresa: this.miEmpresa,
    id_bovedaxml: false,
    index: false
  };
  miObjetoCliente: any = {
    id_empresa: this.miEmpresa,
    buscar: "servive"
  };
  objFactura: any = [];

  constructor(private contabilidadService: ContabilidadService) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  cambioFechas(evt: any){
    var target = evt.target.value;
    if(target == "dia"){
      this.dia = true;
      this.periodo = false;
    }else if(target == "periodo"){
      this.dia = false;
      this.periodo = true;
    }
  }
  private _filter(value: string): string[] {
    if(value.length > 3){
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.nombrecomercial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  getFacturas(value: any){
    this.clienteProveedorID = value;
    console.log(value);
    this.contabilidadService.getFacturas(this.miObjeto)
    .subscribe( (object : any) => {
      if(object.ok){
        this.objFactura = object.datos;
        console.log(object.datos);
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  getClienteProveedor(){
    console.log(this.miObjetoCliente);
    this.contabilidadService.getClienteProveedor(this.miObjetoCliente)
    .subscribe( (object : any) => {
      if(object.ok){
        this.total_registros = object.totales;
        if(this.total_registros > this.taken){
          this.mostrar_pagination = true;
          this.paginar();
        }else{
          this.mostrar_pagination = false;
        }
        //Mostrar usuarios
        this.band = true;       this.options = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  paginar(){
    this.paginas = [];
    let paginas_a_pintar = parseInt(this.total_registros + "")%parseInt(this.taken+"");
    if(paginas_a_pintar == 0){
      paginas_a_pintar = (parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+"");
    }else{
      paginas_a_pintar = ((parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+""))+1;
    }
    //Pintamos las flechas
    if(paginas_a_pintar > this.paginas_a_mostrar){
      this.next = true;
    }
    if(this.pagina_actual == paginas_a_pintar){
      this.next = false;
    }
    if(this.pagina_actual > this.paginas_a_mostrar){
      this.previous = true;
    }
    if(this.pagina_actual == 0){
      this.previous = false;
    }
    //Pintamos las paginas
    for(let i =0;i<this.paginas_a_mostrar;i++){
      let pagina_inicial = this.limite_inferior;
      if(i<paginas_a_pintar){
        if(this.pagina_actual == pagina_inicial+i){
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : "active"
          });
        }else{
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : ""
          });
        }
      }
    }
  }
  irPagina(pagina : any){
    this.pagina_actual = pagina;
    this.getFacturas(this.objFactura);
  }
  busqueda(event: string){
    if(event.length > 3){
      console.log("entro a la busqueda");
      this.miObjetoCliente.buscar = event;
      this.getClienteProveedor();
    }
  }
  guardarCatalogo(f: NgForm) {
    if ( f.invalid ) {
      return;
    }
    // console.log(this.alimento);
    // if (this.alimento.id) {
    //   this.alimentoService.actualizar(this.alimento.id, this.alimento)
    //   .subscribe( objeto => {
    //     console.log(objeto);
    //     this.traerDatos();
    //   });
    // } else {
    //   this.alimentoService.crearAlimento( this.alimento )
    //   .subscribe( objeto => {
    //     console.log(objeto);
    //     this.traerDatos();
    //   });
    // }
  }
}
