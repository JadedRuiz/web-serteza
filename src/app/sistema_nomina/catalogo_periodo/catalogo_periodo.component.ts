import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import { PeriodoService } from 'src/app/services/Periodo/Periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-periodo',
  templateUrl: './catalogo_periodo.component.html',
  styleUrls: ['./catalogo_periodo.component.css']
})
export class CatalogoPeriodoComponent implements OnInit {

  public taken = 5;
  public anio = 0;
  public tipo_modal = 1;
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage["empresa"]);
  public id_nomina = parseInt(window.sessionStorage.getItem("tipo_nomina")+"");
  public tipo_nomina= this.id_nomina;
  myControl = new FormControl();
  public periodos : any;
  public periodo_generado = {
    id_empresa : this.empresa,
    id_nomina : this.tipo_nomina,
    ejercicio : this.anio,
    usuario : this.usuario_logueado,
    periodo_array : new Array
  };
  public modal : any;
  public anios : any;
  public fecha_final_genera : any;
  public nominas : any;
  public palabra = "";
  @ViewChild('content', {static: false}) contenidoDelModal : any;

  constructor(
    private modalService: NgbModal,
    private periodo_service : PeriodoService,
    private nomina_service : NominaService
    ) {}

  ngOnInit(): void {
    this.mostrarPeriodos();
    let f = new Date();
    this.fecha_final_genera = new Date((f.getMonth() +1) + "/" + f.getDate() + "/" + f.getFullYear());
  }

  mostrarPeriodos(){
    this.periodos = [];
    let json = {
      id_empresa : this.empresa,
      id_nomina : this.id_nomina,
      palabra : this.palabra
    };
    this.periodo_service.obtenerPeriodos(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.periodos = object.data;
      }
    });
  }

  mostrarNominasDisp(){
    this.nominas = [];
    let json = {
      id_empresa : this.empresa,
      id_status : 1
    };
    this.nomina_service.obtenerLigaEmpresaNomina(json)
    .subscribe( (object : any) => {
      if(object.ok){
        this.nominas = object.data;
      }
    });
  }

  guardar(){
    this.tipo_modal = 1;
    this.tipo_nomina = this.id_nomina;
    this.anio = 0;
    this.pintarAnios();
    this.mostrarNominasDisp();
    this.openModal();
  }

  editar(id_periodo : any){
    this.tipo_modal = 2;
    this.periodo_service.obtenerPeriodoPorId(id_periodo)
    .subscribe((object : any) => {
      if(object.ok){
        this.openModal();
        this.pintarAnios();
        this.mostrarNominasDisp();
        this.periodo_generado.usuario = this.usuario_logueado;
        this.periodo_generado.id_nomina = object.data.id_nomina;
        this.periodo_generado.ejercicio = object.data.ejercicio;
        this.tipo_nomina = object.data.id_nomina;
        this.anio = object.data.ejercicio;
        this.periodo_generado.periodo_array = object.data.periodo_array[0];
      }
    });
  }

  busqueda(value : any){
    this.palabra = value;
    this.mostrarPeriodos();
  }

  getPeriodo(event : any){

  }

  cambioDeAño(event : any){
   
  }

  pintarAnios(){
    this.anios = [];
    let fecha = new Date();
    let anio_actual = parseInt(fecha. getFullYear()+"");
    for(let i=anio_actual-5;i<anio_actual+5;i++){
      this.anios.push(i);
    }
  }

  generarEjercicio(){
    if(this.anio > 0 && this.tipo_nomina > 0){
      this.periodo_service.fechaFinalEjercicio(this.anio,this.empresa,this.tipo_nomina)
      .subscribe((object : any) => {
        if(object.ok){
          if(object.data.first){
            //primera vez
            let fecha = new Date();
            this.fecha_final_genera = new Date("1/1/"+this.anio);
            this.generar(1, null);
          }else{
            //ya existe un ejercicio
            this.fecha_final_genera = new Date(object.data.data.fecha_final);
            this.fecha_final_genera.setDate(this.fecha_final_genera.getDate()+1);
            this.generar(2, null);
          }
        }else{
          Swal.fire("Ha ocurrido un error",object.data,"info");
        }
      });
    }else{
      Swal.fire("Ha ocurrido un error","Seleccione un ejercicio y el tipo de nómina","info");
    }
  }

  generar(tipo_genera : number, event : any){
    if(this.fecha_final_genera != ""){
      this.nomina_service.obtenerNombreNominaPorId(this.tipo_nomina)
      .subscribe((object : any) => {
        if(object.ok){
          let dias_definidos = 0;       //Almacenara los días que se sumaran en el ciclo
          let dias_pasados = 1;        //Almaceno el número de veces que se iterara por mes
          let tipo = 1;                 //Bit que indicara cual sera el manejo de la fecha inicial
          this.periodo_generado.periodo_array = [];
          switch(object.data[0].nomina){
            case "SEMANAL" : 
              tipo = 1;
              dias_definidos = 7;
              if(tipo_genera == 3) {
                dias_pasados = this.obtenerDias(3,new Date(event));
              }else{
                dias_pasados = this.obtenerDias(3,new Date(this.fecha_final_genera));
              }
              break;
            case "CATORCENAL" : 
              tipo = 1;
              dias_definidos = 14;
              if(tipo_genera == 3) {
                dias_pasados = this.obtenerDias(3,new Date(event));
              }else{
                dias_pasados = this.obtenerDias(3,new Date(this.fecha_final_genera));
              }
              break;
            case "QUINCENAL" : 
              tipo = 2;
              dias_definidos = 15;
              break;
            case "MENSUAL" : 
              tipo = 3;
              break;
          }
          this.periodo_generado.ejercicio = this.anio;
          let mes = parseInt(this.fecha_final_genera.getMonth()+1);
          let total_dias_anio = this.obtenerDias(2,new Date(this.anio,mes,0));
          let fecha_inicial = new Date(this.fecha_final_genera);
          if(tipo_genera == 3){
            fecha_inicial = new Date(event);
            this.fecha_final_genera = new Date(event);
          }
          let mes_completo = this.replaceMes(fecha_inicial.getMonth()+1);
          let id_periodo = 1;
          if(tipo == 1){                      //SEMANAL, CATORCENAL
            let fecha_final = new Date(this.fecha_final_genera.setDate(this.fecha_final_genera.getDate()+(dias_definidos-1)));
            for(let i=dias_pasados;i<total_dias_anio;i+=dias_definidos){
              if(i == dias_pasados){
                this.periodo_generado.periodo_array.push({
                  id_periodo : id_periodo,
                  mes : mes,
                  mes_completo : mes_completo,
                  fecha_inicial : new Date(fecha_inicial.getFullYear(),fecha_inicial.getMonth(),fecha_inicial.getDate()),
                  fecha_final : (fecha_final.getMonth()+1)+"/"+fecha_final.getDate()+"/"+fecha_final.getFullYear(),
                  actual : false,
                  cerrado : false,
                  timbrado : false,
                  inicio_mes : false,
                  fin_de_mes : false,
                  dias_desface : 0,
                  fecha_poliza : new Date(),
                  septimo : 0,
                  ejercicio_inicial : false,
                  ejercicio_final : false,
                  tipo : tipo,
                  band : true
                });
              }else{
                this.periodo_generado.periodo_array.push({
                  id_periodo : id_periodo,
                  mes_completo : mes_completo,
                  mes : mes,
                  fecha_inicial : (fecha_inicial.getMonth()+1)+"/"+fecha_inicial.getDate()+"/"+fecha_inicial.getFullYear(),
                  fecha_final : (fecha_final.getMonth()+1)+"/"+fecha_final.getDate()+"/"+fecha_final.getFullYear(),
                  actual : false,
                  cerrado : false,
                  timbrado : false,
                  inicio_mes : false,
                  fin_de_mes : false,
                  dias_desface : 0,
                  fecha_poliza : new Date(),
                  septimo : 0,
                  ejercicio_inicial : false,
                  ejercicio_final : false,
                  tipo : tipo,
                  band : false
                });
              }
              id_periodo++;
              fecha_inicial = new Date(fecha_final.setDate(fecha_final.getDate()+1));
              mes = fecha_inicial.getMonth()+1;
              mes_completo = this.replaceMes(fecha_inicial.getMonth()+1);
              fecha_final.setDate(fecha_inicial.getDate()+(dias_definidos-1));
            }
          }
          if(tipo == 2){                      //QUINCENAL
            let fecha_final = new Date(this.fecha_final_genera.setDate(this.fecha_final_genera.getDate()+(dias_definidos-1)));
            for(let i=0;i<12;i++){
              this.periodo_generado.periodo_array.push({
                id_periodo : id_periodo,
                mes : mes,
                mes_completo : mes_completo,
                fecha_inicial : (fecha_inicial.getMonth()+1)+"/"+fecha_inicial.getDate()+"/"+fecha_inicial.getFullYear(),
                fecha_final : (fecha_final.getMonth()+1)+"/"+fecha_final.getDate()+"/"+fecha_final.getFullYear(),
                actual : false,
                cerrado : false,
                timbrado : false,
                inicio_mes : true,
                fin_de_mes : false,
                dias_desface : 0,
                fecha_poliza : new Date(),
                septimo : 0,
                ejercicio_inicial : false,
                ejercicio_final : false,
                tipo : tipo
              });
              id_periodo++;
              fecha_inicial = new Date(fecha_final.setDate(fecha_final.getDate()+1));
              mes = fecha_inicial.getMonth()+1;
              mes_completo = this.replaceMes(fecha_inicial.getMonth()+1);
              fecha_final = new Date(this.anio,fecha_inicial.getMonth(),this.obtenerDias(1,new Date(fecha_inicial)));
              this.periodo_generado.periodo_array.push({
                id_periodo : id_periodo,
                mes : mes,
                mes_completo : mes_completo,
                fecha_inicial : (fecha_inicial.getMonth()+1)+"/"+fecha_inicial.getDate()+"/"+fecha_inicial.getFullYear(),
                fecha_final : (fecha_final.getMonth()+1)+"/"+fecha_final.getDate()+"/"+fecha_final.getFullYear(),
                actual : false,
                cerrado : false,
                timbrado : false,
                inicio_mes : false,
                fin_de_mes : true,
                dias_desface : 0,
                fecha_poliza : new Date(),
                septimo : 0,
                ejercicio_inicial : false,
                ejercicio_final : false,
                tipo : tipo
              });
              id_periodo++;
              fecha_inicial = new Date(fecha_final.setDate(fecha_final.getDate()+1));
              mes = fecha_inicial.getMonth()+1;
              mes_completo = this.replaceMes(fecha_inicial.getMonth()+1);
              fecha_final.setDate(fecha_inicial.getDate()+(dias_definidos-1));
            }
          }
          if(tipo == 3){                    //MENSUAL
            let fecha_final = new Date(this.fecha_final_genera.setDate(this.fecha_final_genera.getDate()+(this.obtenerDias(1,this.fecha_final_genera)-1)));
            for(let i = 0; i<12; i++){
              this.periodo_generado.periodo_array.push({
                id_periodo : id_periodo,
                mes : mes,
                mes_completo : mes_completo,
                fecha_inicial : (fecha_inicial.getMonth()+1)+"/"+fecha_inicial.getDate()+"/"+fecha_inicial.getFullYear(),
                fecha_final : (fecha_final.getMonth()+1)+"/"+fecha_final.getDate()+"/"+fecha_final.getFullYear(),
                actual : false,
                cerrado : false,
                timbrado : false,
                inicio_mes : false,
                fin_de_mes : false,
                dias_desface : 0,
                fecha_poliza : new Date(),
                septimo : 0,
                ejercicio_inicial : false,
                ejercicio_final : false,
                tipo : tipo
              });
              id_periodo++;
              fecha_inicial = new Date(fecha_final.setDate(fecha_final.getDate()+1));
              mes = fecha_inicial.getMonth()+1;
              mes_completo = this.replaceMes(fecha_inicial.getMonth()+1);
              fecha_final.setDate(fecha_inicial.getDate()+(this.obtenerDias(1,new Date(this.anio,(fecha_inicial.getMonth()+1),0))-1));
            }
          }
        }
      });
    }else{
      Swal.fire("Ha ocurrido un error","Seleccione una fecha antes","info");
    }
  }

  btn_actual(id : any){
    this.periodo_generado.periodo_array.forEach((element:any) => {
      if(element.id_periodo != id){
        element.actual = false;
      }
    });
  }

  guardarPeriodo(){
    if(this.periodo_generado.periodo_array.length > 0){
      this.confirmar("Confirmación","¿Seguro que deseas agregar el periodo?","info",1,null);
    }else{
      Swal.fire("Ha ocurrido un errror","Antes de guarda debes generar el periodo","error");
    }
  }

  modificarPeriodo(){
    this.confirmar("Confirmación","¿Seguro que deseas modificar el periodo?","info",2,null);
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, data : any){
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
        if(tipo == 1){  //Guardar periodo
          this.periodo_service.crearNuevoPeriodo(this.periodo_generado)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarPeriodos();
              this.cerrarModal();
              Swal.fire("Buen trabajo","El periodo se ha guardado con éxito","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.data,"error");
            }
          });
        }
        if(tipo == 2){  //Editar periodo
          this.periodo_service.modificarPeriodo(this.periodo_generado)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","El periodo se ha modificado con éxito","success");
            }
          });
        }
        if(tipo == 3){
        }
      }
    });
  }

  openModal() {
    this.periodo_generado.periodo_array = [];
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  replaceMes(mes : number):String{
    switch(mes){
      case 1 :
        return "Enero";
      case 2 : 
        return "Febrero";
      case 3 :
        return "Marzo";
      case 4 :
        return "Abril";
      case 5 :
        return "Mayo";
      case 6 :
        return "Junio";
      case 7 :
        return "Julio";
      case 8 :
        return "Agosto";
      case 9 :
        return "Septiembre";
      case 10 :
        return "Octubre";
      case 11 :
        return "Noviembre";
      case 12 :
        return "Diciembre";
    }
    return "";
  }

  obtenerDias(tipo : number, date : any):number{
    let anio_temp = date.getFullYear();
    if(tipo == 1){      //Devuelve el número de días de un mes
      return new Date(anio_temp, (date.getMonth()+1), 0).getDate();
    }
    if(tipo == 2){      //Devuelve el número de día de un año
      let dias = 0;
      for(let i = 0; i<12; i++){
        dias += this.obtenerDias(1,new Date(anio_temp,i,0));
      }
      return dias;
    }
    if(tipo == 3){    //Devuelve el número de días que han transcurrido en un fecha
      let dias = 0;
      for(let i = 1; i<12; i++){
        if(i == (date.getMonth()+1)){
          dias  += date.getDate();
          break;
        }else{
          dias += this.obtenerDias(1,new Date(anio_temp,i,0));
        }
      }
      return dias;
    }
    return 0;
  }

}
