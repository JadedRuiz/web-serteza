import { DetalleTurno } from "./DetalleTurno";

export class Turno {
  constructor(
 public id_turno: number,
 public id_cliente: number,
 public clave: string,
 public turno: string,
 public traslapa_turno: number,
 public rota_turno: number,
 public id_turno_rota: number,
 public tolerancia: number,
 public tiempo_comida: number,
 public token: string,
 public activo: number,
 public id_usuario: number,
 public detalle: DetalleTurno[],
  ){}
}
