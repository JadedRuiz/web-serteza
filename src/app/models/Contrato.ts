
export class Contrato {
    constructor (
        public id_contrato : number,
        public departamento : String,
        public id_departamento : number,
        public empresa : String,
        public id_empresa : number,
        public candidato : String,
        public id_candidato : number,
        public puesto : String,
        public id_puesto : number,
        public fecha_ingreso : String,
        public sueldo : string,
        public descripcion : string,
        public usuario_creacion : number
    ) { }

}