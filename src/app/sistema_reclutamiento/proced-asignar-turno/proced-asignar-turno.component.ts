import { Component, ElementRef, QueryList, ViewChildren, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, Subject, Subscription, } from 'rxjs';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { NuevoUsuario } from 'src/app/models/NuevoUsuario';
import { Perfil } from 'src/app/models/Perfil';
import { MatSelectChange } from '@angular/material/select';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';


@Component({
  selector: 'app-proced-asignar-turno',
  templateUrl: './proced-asignar-turno.component.html',
  styleUrls: ['./proced-asignar-turno.component.css']
})
export class ProcedAsignarTurnoComponent implements OnInit {
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public status = -1; //Status default
  public palabra = "";
  public candidatos : any;
  candidatos_busqueda : any;
  id_empleado:any;
  filterControl = new FormControl();

  filterControlEmpleados = new FormControl();
  objEmpleados: any;
  empleadosIns : any = ''
  color = COLOR
  turnos : any
  turnoSelect: any
  idCandi:any;
  idTurno:any;
  constructor(
    private usuarioService: UsuarioService,
    private turnoService: TurnosService,
    private candidato_service: CandidatoService,

  ) { }

  ngOnInit(): void {
    this.consultarTurnos();

  }


// BARRA DE BUSQUEDA
mostrarCandidatos(){
  let json = {
    palabra : this.palabra.toUpperCase(),
    status : this.status,
    id_cliente : this.id_cliente,
    tipo : 1
  };
  this.candidatos = [];
  this.candidato_service.obtenerCandidatos(json)
  .subscribe( (object : any) =>{
      if(object.ok){
        // this.dataSource.data = object.data;
        // this.dataSource.paginator = this.paginator;
       this.candidatos_busqueda= object.data;
       this.objEmpleados = object.data
      }
  });
}
buscarCandidato(){
  this.palabra = this.filterControl.value;
  if(this.filterControl.value.length < 1){
    this.mostrarCandidatos();
  }
  if(this.filterControl.value.length > 2){
    this.autocomplete(this.filterControl.value);
  }

}
autocomplete(palabra : string){
 // this.candidatos_busqueda = [];
  if(palabra.length > 2){
    let json = {
      nombre_candidato : this.palabra.toUpperCase(),
      status : this.status,
      id_cliente : this.id_cliente
    };
    this.candidato_service.autoCompleteCandidato(json)
    .subscribe((object : any) => {
      if(object.ok){
  console.log('o 3 :>> ');

        this.objEmpleados = object.data;
        this.id_empleado = this.objEmpleados[0].id_candidato
        // console.log('objEmpleados', this.id_empleado);
      }
    })
  }
}
optionUsuario(value : any){
  console.log(value.option.id);
  this.idCandi = value.option.id.id_candidato;
  console.log(this.idCandi);
}


// TURNOS

consultarTurnos(){
  let json = {
    id_turno: 0,
    id_cliente: this.id_cliente,
    turno: "",
    solo_activos: 1,
    token: "012354SDSDS01"
  }
  this.turnoService.obtenerTurnos(json).subscribe(resp => {
    if (resp.ok){
      this.turnos = this.ordenarTurnos(resp.data);

    }
  })
}

 ordenarTurnos(data: any) {
  const turnosOrdenados: any[] = [];

  if (data && data.length > 0) {
    data.forEach((item: any) => {
      const turnoExistente = turnosOrdenados.find((turno: any) => turno.id_turno === item.id_turno);

      if (turnoExistente) {
        turnoExistente.turno = item.turno;
      } else {
        turnosOrdenados.push({
          id_turno: item.id_turno,
          turno: item.turno,
        });
      }
    });
  }
  this.turnoSelect = turnosOrdenados
  console.log('turnosOrdenados :>> ', this.turnoSelect);
}


// ASIGNAR TURNO
optionTurno(event: MatSelectChange) {
  const selectedValue = event.value;
  console.log(selectedValue);
  this.idTurno = selectedValue;
}
asignar(){
  let json = {
    id_candidato_datos: 0,
    id_candidato: this.idCandi,
    id_candidato_jefe: 0,
    id_turno: this.idTurno,
    codigo_nomina: "",
    id_reloj: 0
  }
  console.log('asignar :>> ', json);
  this.turnoService.asignarTurno(json).subscribe(resp => {
    if(resp.ok){
      Swal.fire('Exito',
       resp.mensaje,
        'success');
    }
    if(!resp.ok){
      console.log(resp);
      Swal.fire(resp.mensaje,
      '',
       'warning');
    }
  })
}

}
