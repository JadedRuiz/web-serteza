import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { Turno } from 'src/app/models/Turno';
import { DetalleTurno } from 'src/app/models/DetalleTurno';


@Component({
  selector: 'app-catalogo-turnos',
  templateUrl: './catalogo-turnos.component.html',
  styleUrls: ['./catalogo-turnos.component.css']
})
export class CatalogoTurnosComponent implements OnInit {
  public color = COLOR;
  public turnos: { [key: string]: any; } | undefined;
  public turno = new Turno(0,5,'','',0,0,0,0,0,'',1,0,[]);


  constructor(
    private turnosService: TurnosService,

  ) { }

  ngOnInit(): void {

    this.obtenerTurnos();
  }


  agregarDetalle() {
    let detalleTurno = new DetalleTurno(0, 0, '', '', 0);
    this.turno.detalle.push(detalleTurno);
  }

  obtenerTurnos() {
    let json = {
      id_turno: 0,
      id_cliente: 5,
      turno: "",
      solo_activos: 1,
      token: "012354SDSDS01"
    }
    this.turnosService.obtenerTurnos(json).subscribe((resp) => {
      console.log('Turnos :>> ', resp.data);
      // Agrupar los datos por id_turno
      this.turnos = this.groupTurnos(resp.data);
    });
  }

  groupTurnos(data:any) {
    const grouped:any = {};
    data.forEach((item:any) => {
      const idTurno = item.id_turno;
      if (!grouped[idTurno]) {
        grouped[idTurno] = [];
      }
      grouped[idTurno].push(item);
    });
    return grouped;
  }


  agregarTurno(){
    let json = {
    id_turno: 0,
    id_cliente: 5,
    clave: "TURNO 3",
    turno: this.turno.turno,
    traslapa_turno: 0,
    rota_turno: 0,
    id_turno_rota: 0,
    tolerancia: this.turno.tolerancia,
    tiempo_comida: 0,
    token: "012354SDSDS01",
    activo: 1,
    id_usuario: 1,
    detalle: [
      {
          id_det_turno: 0,
          dia: 1,
          hr_entrada: "07:00",
          hr_salida: "13:00",
          descanso: 0
      },
      {
          "id_det_turno": 0,
          "dia": 2,
          "hr_entrada": "07:00",
          "hr_salida": "13:00",
          "descanso": 0
      },
      {
          "id_det_turno": 0,
          "dia": 3,
          "hr_entrada": "07:00",
          "hr_salida": "13:00",
          "descanso": 0
      },
      {
          "id_det_turno": 0,
          "dia": 4,
          "hr_entrada": "09:00",
          "hr_salida": "17:00",
          "descanso": 0
      },
      {
          "id_det_turno": 0,
          "dia": 5,
          "hr_entrada": "09:00",
          "hr_salida": "17:00",
          "descanso": 0
      },
      {
          "id_det_turno": 0,
          "dia": 6,
          "hr_entrada": "09:00",
          "hr_salida": "17:00",
          "descanso": 1
      },
      {
          "id_det_turno": 0,
          "dia": 7,
          "hr_entrada": "",
          "hr_salida": "",
          "descanso": 1
      }
  ]
    }
    console.log('=>',json);
  }


}
