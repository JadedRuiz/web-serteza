export class Justificacion  {
  constructor(
    public id_justificacion: number,
    public id_cliente: number,
    public id_candidato: number,
    public motivo: string,
    public fecha: string,
    public nombre_completo?: string
  ) {}

}
