import { Direccion } from 'src/app/models/Direccion';
export class Empleado {
    constructor(
        public numero_empleado: number,
        public apellido_paterno: String,
        public apellido_materno: String,
        public nombre: String,
        public rfc: String,
        public curp: String,
        public numero_seguro: String,
        public fecha_nacimiento: String,
        public edad: number,
        public lugar_nacimiento: String,
        public correo: String,
        public telefono_1: String,
        public telefono_2: String,
        public telefono_3: String,
        public descripcion: String,
        public direccion : Direccion
    ){}
}
