export class Festivos {
  constructor(
        public id_dia_festivo: number,
        public id_cliente: number,
        public ejercicio: number,
        public descripcion: string,
        public fecha: string,
        public token: string,
        public activo: number,
        public id_usuario: number,
        public solo_activos?: number,
  ){}
}
