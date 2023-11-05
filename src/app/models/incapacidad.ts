export class Incapacidad {
  constructor (
    public id_incapacidad : number,
    public id_cliente : number,
    public id_candidato : number,
    public folio : string,
    public dias_incapacidad : number,
    public fecha_inicial : any,
    public fecha_final : any,
    public activo : number,
    public token : string,
    public id_usuario : number,
    public nombre_completo?: string,
) { }
}
