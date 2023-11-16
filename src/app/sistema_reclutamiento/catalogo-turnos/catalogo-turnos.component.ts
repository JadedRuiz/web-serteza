import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { Turno } from 'src/app/models/Turno';
import { DetalleTurno } from 'src/app/models/DetalleTurno';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalogo-turnos',
  templateUrl: './catalogo-turnos.component.html',
  styleUrls: ['./catalogo-turnos.component.css'],
})
export class CatalogoTurnosComponent implements OnInit {
  public color = COLOR;
  public turnos: { [key: string]: any } | undefined;
  public detalle = new DetalleTurno(0, 0, '', '', 0);
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  public id_candidato = parseInt(window.sessionStorage.getItem("candidato")+"");
  public turno = new Turno(0, this.id_cliente, '', '', 0, 0, 0, 0, 0, '', 1, 0, [
    this.detalle,
  ]);

  @ViewChild('cerrarModal', { static: true }) cerrarModal?: ElementRef;
  public isChecked: any;
  public editando = false;
  public displayedColumns: string[] = ['clave', 'turno'];
  public dataSource = new MatTableDataSource();
  public horaEntrada: any = '';
  public turnoSeleccionado: any = '';
  public editTurno : boolean = false;
  public newTurno : boolean =true;
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
    this.turnosService.obtenerTurnos(json).subscribe((resp) => {
      // Agrupar los datos por id_turno
      this.turnos = this.groupTurnos(resp.data);
      // console.log('TurnosJson :>> ', this.dataSource);
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
    } else {
      this.turnoSeleccionado.traslapa_turno = 0;
    }
  }

  updateRota(){
    if(this.turnoSeleccionado){
      this.turnoSeleccionado.rota_turno= 1;
    }else{
      this.turnoSeleccionado.rota_turno = 0;
    }

  }

  updateDescanso(){
    if(this.turnoSeleccionado){
      this.turnoSeleccionado.detalle.dia.descanso == 1
    }else {
      this.turnoSeleccionado.detalle.dia.descanso == 0
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
      this.id_cliente,
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
    console.log('0',this.turnoSeleccionado)
  }


  editar(turno:any){
    this.newTurno = false;
    let detTurno = new Array<DetalleTurno>();
    detTurno.push(new DetalleTurno(0, 0, turno.value[0].hr_entrada, turno.value[0].hr_salida, Number(turno.value[0].descanso), turno.value[0].dia_descrip));
    detTurno.push(new DetalleTurno(0, 1, turno.value[1].hr_entrada, turno.value[1].hr_salida, Number(turno.value[1].descanso), turno.value[1].dia_descrip));
    detTurno.push(new DetalleTurno(0, 2, turno.value[2].hr_entrada, turno.value[2].hr_salida, Number(turno.value[2].descanso), turno.value[2].dia_descrip));
    detTurno.push(new DetalleTurno(0, 3, turno.value[3].hr_entrada, turno.value[3].hr_salida, Number(turno.value[3].descanso), turno.value[3].dia_descrip));
    detTurno.push(new DetalleTurno(0, 4, turno.value[4].hr_entrada, turno.value[4].hr_salida, Number(turno.value[4].descanso), turno.value[4].dia_descrip));
    detTurno.push(new DetalleTurno(0, 5, turno.value[5].hr_entrada, turno.value[5].hr_salida, Number(turno.value[5].descanso), turno.value[5].dia_descrip));
    detTurno.push(new DetalleTurno(0, 6, turno.value[6].hr_entrada, turno.value[6].hr_salida, Number(turno.value[6].descanso), turno.value[6].dia_descrip));

    this.turnoSeleccionado = new Turno(
      turno.value[0].id_turno,
      this.id_cliente,
      turno.value[0].clave,
      turno.value[0].turno,
      Number(turno.value[0].traslapa_turno),
      Number(turno.value[0].rota_turno),
      Number(turno.value[0].id_turno_rota),
      Number(turno.value[0].tolerancia),
      Number(turno.value[0].tiempo_comida),
      'Token',
      1,
      1,
      detTurno
    );
    console.log('0',this.turnoSeleccionado)
    console.log('-*',turno.value)
  }

  actualizar(){
    let json = this.turnoSeleccionado
    console.log('json :>> ', json);

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
      this.turno.tiempo_comida = this.turnoSeleccionado.tiempo_comida;
      this.turno.id_turno_rota = this.turnoSeleccionado.id_turno_rota;

      this.turno.token = 'token';
      this.turno.id_turno = 0;
      this.turno.activo = 1;
      this.turno.id_usuario = 1;
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

      // this.guardar();
      console.log('this.turno :>> ', this.turno);

    }

  }


  guardar() {
    let json = this.turno;

    this.turnosService.agregarTurnos(json).subscribe((resp) => {
      if (resp.ok) {
        Swal.fire(resp.data.mensaje, '', 'success');
        console.log('resp :>> ', resp);
        this.obtenerTurnos();
      }
    });
    console.log('Guardar ->', json);
    if (this.cerrarModal && this.cerrarModal.nativeElement) {
      this.cerrarModal.nativeElement.click();
    }
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
