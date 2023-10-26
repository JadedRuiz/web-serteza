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


@Component({
  selector: 'app-proced-asignar-turno',
  templateUrl: './proced-asignar-turno.component.html',
  styleUrls: ['./proced-asignar-turno.component.css']
})
export class ProcedAsignarTurnoComponent implements OnInit {
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");

  usuarios_busqueda : any;
  usuarios : any;
  filterControl = new FormControl();
  color = COLOR
  turnos : any
  turnoSelect: any
  idCandi:any;
  idTurno:any;
  constructor(
    private usuarioService: UsuarioService,
    private turnoService: TurnosService,
  ) { }

  ngOnInit(): void {
    this.consultarTurnos();
  this.mostrarUsuarios();

  }


// BARRA DE BUSQUEDA
mostrarUsuarios(){
  let json = {
    id_usuario: 0,
    id_cliente: this.id_cliente,
    id_sistema: 2,
    usuario: '',
    solo_activos: 1,
    id_usuario_consulta: 0,
    token: '012354SDSDS01',
  };
  this.usuarioService.consultarUsuarios(json).subscribe((resp) => {
    if (resp.ok) {
      // console.log('Usuarios :>> ', resp.data);
      this.usuarios = resp.data;
      this.usuarios_busqueda = resp.data;
      console.log(this.usuarios);
    }
  });

}

buscarUsuario(){

  if(this.filterControl.value.length > 1){
  this.usuarios_busqueda = [];
  this.usuarios.forEach((element : any) => {
    this.usuarios_busqueda.push({
      "nombre" : element.nombre,
      "id_usuario" : element.id_usuario
    });
  });
}
  if(this.filterControl.value.length > 2){
    this.usuarios_busqueda = [];
    this.usuarios.forEach((element : any) => {
      if(element.nombre.includes(this.filterControl.value)){
        this.usuarios_busqueda.push({
          "nombre" : element.nombre,
          "id_usuario" : element.id_usuario
        })
      }
    });
    console.log('userBusqueda=>',this.usuarios_busqueda);
  }
}

optionUsuario(value : any){
  console.log(value.option.id);
  this.idCandi = value.option.id;
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
       resp.message,
        'success');
    }
    if(!resp.ok){
      console.log(resp);
      Swal.fire(resp.message,
      '',
       'warning');
    }
  })
}

}
