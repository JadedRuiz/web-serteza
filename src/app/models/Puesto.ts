export class Puesto {

    constructor(
        public id_puesto : number,
        public puesto : String,
        public disponibilidad : String,
        public descripcion : String,
        public usuario : number,
        public activo : number
    ){}
}