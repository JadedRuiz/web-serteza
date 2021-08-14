export class Concepto {
    constructor(
        public folio : number,
        public id_empleado : number,
        public empleado : string,
        public fotografia : string,
        public unidades : string,
        public importe : string,
        public saldo : string,
        public conceptos : Array<ConceptoUnitario>
    ){}
    
}
export class ConceptoUnitario{
    constructor(
        public id_concepto : number,
        public concepto : string,
        public unidades : string,
        public importe : string,
        public saldo : string,
        public ajuste : string
    ){}
}