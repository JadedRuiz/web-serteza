export class Direccion {
    constructor(
        public calle : number,
        public num_exterior : String,
        public num_interior : String,
        public cruzamiento_ext : String,
        public cruzamiento_int : String,
        public codigo_postal : String,
        public colonia : String,
        public localidad : String,
        public municipio : String,
        public estado : String,
        public descripcion : String
    ){}
}