import { Direccion } from 'src/app/models/Direccion';
export class Operador {
    constructor(
        public id_empresa : number,
        public rfc : String,
        public nom_operador : String,
        public num_licencia : String,
        public tipo_persona : String,
        public direccion : Direccion
    ){}
    
}