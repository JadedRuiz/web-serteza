
export class Contrato {
    constructor (
        public id_contrato : number,
        public id_departamento : number,
        public id_empresa : number,
        public id_candidato : number,
        public id_puesto : number,
        public fecha_ingreso : String,
        public sueldo : string,
        public usuario_creacion : number
    ) { }

}