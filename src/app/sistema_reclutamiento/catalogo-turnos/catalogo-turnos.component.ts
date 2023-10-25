import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { Turno } from 'src/app/models/Turno';
import { DetalleTurno } from 'src/app/models/DetalleTurno';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-catalogo-turnos',
  templateUrl: './catalogo-turnos.component.html',
  styleUrls: ['./catalogo-turnos.component.css'],
})
export class CatalogoTurnosComponent implements OnInit {
  public color = COLOR;
  public turnos: { [key: string]: any } | undefined;
  public detalle = new DetalleTurno(0, 0, '', '', 0);
  public turno = new Turno(0, 5, '', '', 0, 0, 0, 0, 0, '', 1, 0, [
    this.detalle,
  ]);
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  public id_candidato = parseInt(window.sessionStorage.getItem("candidato")+"");
  public isChecked: any;
  public editando = false;
  public displayedColumns: string[] = ['clave', 'turno'];
  public dataSource = new MatTableDataSource();
  public horaEntrada: any = '';
  public turnoSeleccionado: any = '';
  public editTurno : boolean = false;
  public newTurno : boolean = false;
  constructor(
    private turnosService: TurnosService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.obtenerTurnos();
  }

    // OBTENER Y ORDENAR TURNOS
  obtenerTurnos() {
    let json = {
      id_turno: 0,
      id_cliente: this.id_cliente,
      turno: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
     console.log('TurnosJson :>> ', json);
    this.turnosService.obtenerTurnos(json).subscribe((resp) => {
      // Agrupar los datos por id_turno
      this.turnos = this.groupTurnos(resp.data);
    });
  }

  groupTurnos(data: any) {
    const grouped: any = {};
    data.forEach((item: any) => {
      const idTurno = item.id_turno;
      if (!grouped[idTurno]) {
        grouped[idTurno] = [];
      }
      grouped[idTurno].push(item);
    });
    this.dataSource.data = grouped;
    return grouped;
  }



  updateTraslapa() {
    if (this.turnoSeleccionado) {
      this.turnoSeleccionado.traslapa_turno = 1;
      this.turnoSeleccionado.rota_turno = 1;
    } else {
      this.turnoSeleccionado.traslapa_turno = 0;
      this.turnoSeleccionado.rota_turno = 0;
    }
  }

  // Creamos turno seleccionado
  nuevoturno() {
    let detTurno = new Array<DetalleTurno>();
    detTurno.push(new DetalleTurno(0, 0, '', '', 0, 'Lunes'));
    detTurno.push(new DetalleTurno(0, 1, '', '', 0, 'Martes'));
    detTurno.push(new DetalleTurno(0, 2, '', '', 0, 'Miercoles'));
    detTurno.push(new DetalleTurno(0, 3, '', '', 0, 'Jueves'));
    detTurno.push(new DetalleTurno(0, 4, '', '', 0, 'Viernes'));
    detTurno.push(new DetalleTurno(0, 5, '', '', 0, 'Sabado'));
    detTurno.push(new DetalleTurno(0, 6, '', '', 0, 'Domingo'));

    this.turnoSeleccionado = new Turno(
      0,
      5,
      '',
      '',
      0,
      0,
      0,
      0,
      0,
      '',
      1,
      0,
      detTurno
    );
     this.editando = false;
    this.newTurno = true;
  }

  editarTurno(turnoSeleccionado: any) {
     this.editando = true;
    this.newTurno = false;

    this.turnoSeleccionado = {
      clave: turnoSeleccionado.value[0].clave,
      turno: turnoSeleccionado.value[0].turno,
      torelancia: turnoSeleccionado.value[0].tolerancia,
      tiempo_comidaa: turnoSeleccionado.value[0].tiempo_comida,
      turno_id: turnoSeleccionado.value[0].id_turno,
      traslapa_turno: turnoSeleccionado.value[0].traslapa_turno,
      rota_turno: turnoSeleccionado.value[0].rota_turno,
      detalle: turnoSeleccionado.value,
    };
     console.log('Turno Selecionado=>>', this.turnoSeleccionado);
  }

  guardarNuevo() {
    if (this.newTurno) {
      this.turno.clave = this.turnoSeleccionado.clave;
      this.turno.tiempo_comida = this.turnoSeleccionado.tiempo_comida;
      this.turno.tolerancia = this.turnoSeleccionado.tolerancia;
      this.turno.traslapa_turno = this.turnoSeleccionado.traslapa_turno;
      this.turno.rota_turno = this.turnoSeleccionado.rota_turno;
      this.turno.detalle = this.turnoSeleccionado.detalle;
      this.turno.turno = this.turnoSeleccionado.turno;

      this.turno.token = 'token';
      this.turno.id_turno = 0;
      this.turno.activo = 1;
      //  console.log("DetalleTurno=>>",this.turno.detalle)

      for (const dia of this.turno.detalle) {
        const diaSeleccionado = this.turnoSeleccionado.detalle.find(
          (d: any) => d.dia === dia.dia
        );
        if (diaSeleccionado) {
          dia.hr_entrada = diaSeleccionado.hr_entrada;
          dia.hr_salida = diaSeleccionado.hr_salida;
          dia.descanso = diaSeleccionado.descanso ? 1 : 0;
        }
      }

      this.guardar();
      this.newTurno = false;
    } else {

      // this.editando = true;
    }
  }

  turnoEditado(){
    this.turno = new Turno(0, 5, '', '', 0, 0, 0, 0, 0, '', 1, 0, [
      this.detalle,
    ]);
    this.editando=true
    this.newTurno = false;
    this.turno.clave = this.turnoSeleccionado.clave;
    this.turno.tiempo_comida = this.turnoSeleccionado.tiempo_comida;
    this.turno.tolerancia = this.turnoSeleccionado.tolerancia;
    this.turno.traslapa_turno = this.turnoSeleccionado.traslapa_turno;
    this.turno.rota_turno = this.turnoSeleccionado.rota_turno;
    this.turno.detalle = this.turnoSeleccionado.detalle;
    this.turno.turno = this.turnoSeleccionado.turno

    this.turno.token = 'token';
    this.turno.id_turno = this.turnoSeleccionado.turno_id;
    this.turno.activo = 1;
    // console.log("DetalleTurno=>>",this.turno.detalle)

    for (const dia of this.turno.detalle) {
      const diaSeleccionado = this.turnoSeleccionado.detalle.find(
        (d: any) => d.dia === dia.dia
      );
      if (diaSeleccionado) {
        dia.hr_entrada = diaSeleccionado.hr_entrada;
        dia.hr_salida = diaSeleccionado.hr_salida;
        dia.descanso = diaSeleccionado.descanso ? 1 : 0;
      }
    }
    console.log('edit?', this.turnoSeleccionado);
    //  this.guardar();
    // Activa el modo de edición.
  }

  guardar() {
    let json = this.turno;

    this.turnosService.agregarTurnos(json).subscribe((resp) => {
      if (resp.ok) {
        Swal.fire('Exito', 'turno guardado', 'success');
        this.obtenerTurnos();
      }
    });
    console.log('Guardar ->', json);
  }

  activar(turnoSeleccionado: any) {
    this.editando = false;

    Swal.fire({
      title: '¿Quieres desactivar el turno?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.turnoSeleccionado = {
          turnoID: turnoSeleccionado.value[0].id_turno,
        };
        let json = {
          id_turno: this.turnoSeleccionado.turnoID,
          token: '012354SDSDS01',
          id_usuario: 1,
        };
        this.turnosService.activarTurno(json).subscribe((resp) => {
          if (resp.ok) {
            Swal.fire('Exito', 'el turno fue desactivado', 'success');
            this.obtenerTurnos();
          }
        });
        // console.log('json :>> ', json);
      }
    });
  }


}
