export class Puesto {

    constructor(
        public id_puesto : number,
        public puesto : String,
        public sueldo_tipo_a : String,
        public sueldo_tipo_b : String,
        public sueldo_tipo_c : String,
        public autorizados : String,
        public descripcion : String,
        public usuario : number,
        public activo : number
    ){}
}