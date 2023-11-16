export class NuevoUsuario {
  constructor(
    public id_usuario: number,
    public id_cliente: number,
    public id_sistema: number,
    public id_candidato: number,
    public token: string,
    public nombre: string,
    public usuario: string,
    public password: string,
    public id_perfil: number,
    public activo: number,
    public id_usuario_guardar: number,
    public id_fotografia: number,
    public fotografia: string,
    public extencion: string,
    public foto_base64: string,
    public nombre_completo?: string
  ) { }
}
