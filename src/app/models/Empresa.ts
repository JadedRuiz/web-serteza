import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
export class Empresa {
    constructor(
        public id : number,
        public id_status : number,
        public usuario_sistema_id : number,
        public empresa : String, 
        public rfc : String,
        public razon_social : String,
        public descripcion : String, 
        public cat_usuario_id : number,
        public direccion : Direccion,
        public fotografia : Fotografia
    ){}
    
}