import { Candidato } from 'src/app/models/Candidato';

export class Empleado{
    constructor(
        public id_empleado : number,  
        public id_estatus : number, 
        public id_nomina : number, 
        public id_puesto : number, 
        public id_sucursal : number, 
        public id_registropatronal : number, 
        public id_catbanco : number, 
        public id_contratosat : number, 
        public folio : number, 
        public candidato : Candidato,
        public fecha_ingreso : string, 
        public fecha_antiguedad : string, 
        public cuenta : string, 
        public tarjeta : string, 
        public clabe : string, 
        public tipo_salario : string, 
        public jornada : string, 
        public sueldo_diario : string, 
        public sueldo_integrado : string, 
        public sueldo_complemento : string, 
        public aplicarsueldoneto : any, 
        public sinsubsidio : any, 
        public prestaciones_antiguedad : any, 
        public usuario_creacion : number
    ){}
}