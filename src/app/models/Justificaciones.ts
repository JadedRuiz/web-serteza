export class Justificacion  {
  constructor(
    public id_justificacion: number,
    public id_candidato: number,
    public nombre_completo: string,
    public folio: string,
    public fecha: string,
    public motivo: string,
    public activo: number,
    public autorizado: number,
    public dia: string,
    public dia_descrip: string,
    public id_empresa: number,
    public empresa: string,
    public id_departamento: number,
    public departamento: string,
    public id_sucursal: number,
    public sucursal: string,
    public id_puesto: number,
    public puesto: string,
    public id_cliente: number,
    public fotografia: string,
  ) {}

}
