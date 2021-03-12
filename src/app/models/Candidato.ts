import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
export class Candidato {
    constructor(
        public id : number, 
        public cat_clientes_id : number,
        public cat_fotografia_id : number, 
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
        public telefono : number, 
        public telefono_dos : number, 
        public telefono_tres : number, 
        public descripcion : String, 
        public cat_usuario_id : number,
        public direccion : Direccion,
        public fotografia : Fotografia
    ){}
    
}