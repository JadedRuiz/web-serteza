import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { Turno } from 'src/app/models/Turno';
import { DetalleTurno } from 'src/app/models/DetalleTurno';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-catalogo-turnos',
  templateUrl: './catalogo-turnos.component.html',
  styleUrls: ['./catalogo-turnos.component.css'],
})


export class CatalogoTurnosComponent implements OnInit {
  public color = COLOR;
  public turnos: { [key: string]: any } | undefined;
  public detalle = new DetalleTurno(0, 0, '', '', 0);
  public turno = new Turno(0, 5, '', '', 0, 0, 0, 0, 0, '', 1, 0, [this.detalle,]);
  public isChecked: any;
  editando = false;
  displayedColumns: string[] = ['clave', 'turno'];
  dataSource = new MatTableDataSource();

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.obtenerTurnos();
  }


  obtenerTurnos() {
    let json = {
      id_turno: 0,
      id_cliente: 5,
      turno: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.turnosService.obtenerTurnos(json).subscribe((resp) => {
      // console.log('Turnos :>> ', resp.data);
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


  onCheckboxChange(event: any) {
    // Si el checkbox está marcado, establece isChecked en 1; de lo contrario, en 0.
    this.isChecked = event.checked ? 1 : 0;
  }
  updateTraslapa() {
    if (this.turnoSeleccionado) {
      this.turnoSeleccionado.traslapa_turno = 1;
      this.turnoSeleccionado.rota_turno = 1;
      this.turnoSeleccionado.dia.descanso = 1;
    } else {
      this.turnoSeleccionado.traslapa_turno = 0;
      this.turnoSeleccionado.rota_turno = 0;
      this.turnoSeleccionado.dia.descanso = 0;
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
    this.editando = true;


    // let json = this.turnoSeleccionado;

    //  console.log('OK nuevo', json);
    // this.turnosService.agregarTurnos(json).subscribe((resp) => {
    //   if (resp.ok) {
    //     Swal.fire('Exito', resp.message, 'success');
    //   }
    // });
  }



  // --------------
  turnoSeleccionado: any = '';
  editarTurno(turnoSeleccionado: any) {
    // this.editando =false; // Indica que estás editando un turno existente
    this.turnoSeleccionado = {
      clave: turnoSeleccionado.value[0].clave,
      turno: turnoSeleccionado.value[0].turno,
      turno_id: turnoSeleccionado.value[0].id_turno,
      traslapa_turno: turnoSeleccionado.value[0].traslapa_turno,
      rota_turno: turnoSeleccionado.value[0].rota_turno,
      detalle: turnoSeleccionado.value,
    };
    console.log("Turno Selecionado=>>",this.turnoSeleccionado)
  }

  horaEntrada: any = '';
  toggleEditingMode() {
    if (this.editando) {
      this.turno.clave = this.turnoSeleccionado.clave;
      this.turno.turno = this.turnoSeleccionado.turno;
      this.turno.traslapa_turno = this.turnoSeleccionado.traslapa_turno;
      this.turno.rota_turno = this.turnoSeleccionado.rota_turno;
      this.turno.detalle = this.turnoSeleccionado.detalle;
      this.turno.id_turno = this.turnoSeleccionado.turno_id;
      // console.log("DetalleTurno=>>",this.turno.detalle)

      for (const dia of this.turno.detalle) {
        const diaSeleccionado = this.turnoSeleccionado.detalle.find(
          (d: any) => d.dia === dia.dia
        );
        if (diaSeleccionado) {
          dia.hr_entrada = diaSeleccionado.hr_entrada;
          dia.hr_salida = diaSeleccionado.hr_salida;
          dia.descanso = diaSeleccionado.descanso;
        }
      }

      this.guardar();
      this.editando = false;
    } else {
      // Activa el modo de edición.
      this.editando = true;
    }
    this.obtenerTurnos();

  }

guardar(){
   let json = this.turno;

      this.turnosService.agregarTurnos(json).subscribe((resp) => {
        if (resp.ok) {
          console.log('OK');
        }
      });
      console.log("==", json);
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
          }
        });
        console.log('json :>> ', json);
        this.obtenerTurnos();
      }
    });
  }

  // --------------------------- Sin usar

  // agregarTurno(){
  //   let json = {
  //   id_turno: 0,
  //   id_cliente: 5,
  //   clave: this.turno.clave,
  //   turno: this.turno.turno,
  //   traslapa_turno: 0,
  //   rota_turno: 0,
  //   id_turno_rota: 0,
  //   tolerancia: this.turno.tolerancia,
  //   tiempo_comida: 0,
  //   token: "012354SDSDS01",
  //   activo: 1,
  //   id_usuario: 1,
  //   detalle: [
  //     {
  //         id_det_turno: 0,
  //         dia: 1,
  //         hr_entrada: "07:00",
  //         hr_salida: "13:00",
  //         descanso: 0
  //     },
  //     {
  //         id_det_turno: 0,
  //         dia: 2,
  //         hr_entrada: "07:00",
  //         hr_salida: "13:00",
  //         descanso: 0
  //     },
  //     {
  //         id_det_turno: 0,
  //         dia: 3,
  //         hr_entrada: "07:00",
  //         hr_salida: "13:00",
  //         descanso: 0
  //     },
  //     {
  //         id_det_turno: 0,
  //         dia: 4,
  //         hr_entrada: "09:00",
  //         hr_salida: "17:00",
  //         descanso: 0
  //     },
  //     {
  //         id_det_turno: 0,
  //         dia: 5,
  //         hr_entrada: "09:00",
  //         hr_salida: "17:00",
  //         descanso: 0
  //     },
  //     {
  //         id_det_turno: 0,
  //         dia: 6,
  //         hr_entrada: "09:00",
  //         hr_salida: "17:00",
  //         descanso: 1
  //     },
  //     {
  //         id_det_turno: 0,
  //         dia: 7,
  //         hr_entrada: "7:00",
  //         hr_salida: "17:00",
  //         descanso: 1
  //     }
  // ]
  //   }
  //   console.log('=>',json);
  // }



}
