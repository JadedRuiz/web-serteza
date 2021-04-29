import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
export class Candidato {
    constructor(
        public id_candidato : number, 
        public id_cliente : number,
        public apellido_paterno : String, 
        public apellido_materno : String, 
        public nombre : String, 
        public rfc : String, 
        public curp : String, 
        public numero_social : String, 
        public fecha_nacimiento : String,
        public lugar_nacimiento : String,
        public edad : number, 
        public correo : String, 
        public telefono : String, 
        public telefono_dos : String, 
        public telefono_tres : String, 
        public descripcion : String, 
        public usuario_creacion : number,
        public direccion : Direccion,
        public fotografia : Fotografia
    ){}
    
}