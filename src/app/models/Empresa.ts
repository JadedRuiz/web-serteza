import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
export class Empresa {
    constructor(
        public id_empresa : number,
        public id_statu : number,
        public empresa : String, 
        public rfc : String,
        public razon_social : String,
        public descripcion : String, 
        public usuario_creacion : number,
        public direccion : Direccion,
        public fotografia : Fotografia,
        public activo : number
    ){}
    
}