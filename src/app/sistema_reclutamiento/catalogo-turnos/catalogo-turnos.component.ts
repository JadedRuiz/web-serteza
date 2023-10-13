import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { Turno } from 'src/app/models/Turno';

@Component({
  selector: 'app-catalogo-turnos',
  templateUrl: './catalogo-turnos.component.html',
  styleUrls: ['./catalogo-turnos.component.css']
})
export class CatalogoTurnosComponent implements OnInit {
  public color = COLOR;
  public turnos: { [key: string]: any; } | undefined;

  constructor(
    private turnosService: TurnosService,

  ) { }

  ngOnInit(): void {

    this.obtenerTurnos();
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


}
