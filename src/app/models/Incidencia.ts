export class Incidencia {
    constructor(
        public folio : number,
        public id_empleado : number,
        public nombre : string,
        public fotografia : string,
        public conceptos : Array<Concepto>,
        public editar : boolean,
        public concepto_seleccionado : number
    ){}
    
}
export class Concepto{
    constructor(
        public id_concepto : number,
        public concepto : string,
        public unidades : string,
        public importe : string,
        public saldo : string,
        public ajuste : string
    ){}
}