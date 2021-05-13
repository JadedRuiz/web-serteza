export class Departamento {
    constructor(
        public id_departamento : number, 
        public id_empresa : number,
        public departamento : String, 
        public descripcion : String, 
        public disponibilidad : number, 
        public usuario_creacion : number, 
        public activo : number,
        public puestos : any
    ){}
}