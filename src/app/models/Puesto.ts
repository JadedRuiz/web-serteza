export class Puesto {

    constructor(
        public id_arreglo : number,
        public id_puesto : number,
        public puesto : String,
        public sueldo_tipo_a : any,
        public sueldo_tipo_b : any,
        public sueldo_tipo_c : any,
        public band_puesto : any,
        public autorizados : String,
        public descripcion : String,
        public usuario : number,
        public activo : number
    ){}
}