import { Direccion } from 'src/app/models/Direccion';
export class Cliente {
    constructor(
        public id : number,
        public cliente : String, 
        public contacto : number, 
        public descripcion : String, 
        public cat_usuario_sistema : number,
        public cat_usuario_id : number,
        public direccion : Direccion,
    ){}
    
}