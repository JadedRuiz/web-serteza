export class Incapacidad {
  constructor (
    public id_incapacidad : number,
    public id_cliente : number,
    public id_candidato : number,
    public folio : string,
    public dias_incapacidad : number,
    public fecha_inicial : string,
    public fecha_final : string,
    public activo : number,
    public token : string,
    public id_usuario : number,
    public nombre_completo?: string,
) { }
}
