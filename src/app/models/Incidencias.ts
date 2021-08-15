import { Incidencia } from "./Incidencia";
export class Incidencias {
    constructor(
        public id_nomina : number,
        public id_periodo : number,
        public incidencias : Incidencia[]
    ){}
    
}