export class Direccion {
    constructor(
        public id_direccion : number,
        public calle : string,
        public numero_exterior : String,
        public numero_interior : String,
        public cruzamiento_uno : String,
        public cruzamiento_dos : String,
        public codigo_postal : String,
        public colonia : String,
        public localidad : String,
        public municipio : String,
        public estado : String,
        public descripcion : String
    ){}
}