export class PAcceso {
  constructor(
    public id_reloj:number,
    public id_cliente:number,
    public ubicacion:string,
    public latitud:string,
    public longitud:string,
    public direccion_ip:string,
    public distancia_km:number,
    public token:string,
    public id_usuario:number

  ) { }
}
