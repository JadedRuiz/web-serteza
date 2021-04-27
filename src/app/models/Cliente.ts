import { Direccion } from 'src/app/models/Direccion';
export class Cliente {
    constructor(
        public id_cliente : number,
        public cliente : String, 
        public contacto : "", 
        public descripcion : String, 
        public cat_usuario_sistema : number,
        public usuario_creacion : number,
        public direccion : Direccion,
        public activo : number
    ){}
    
}