export class Perfil {
  constructor(
    public id_perfil: number,
    public id_sistema: string,
    public perfil: string,
    public solo_activos: number,
    public token: string
  ){}
}
