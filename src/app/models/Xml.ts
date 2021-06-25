export class Xml {
    constructor(
        public tipo: string, 
        public uuid: string, 
        public fechaTimbrado: string, 
        public fecha: string, 
        public rfcEmisor: string, 
        public rfcReceptor: string, 
        public razonEmisor: string, 
        public razonReceptor: string, 
        public folio: string, 
        public metodopago: string, 
        public formapago: string, 
        public moneda: string, 
        public subtotal: number, 
        public total: number, 
        public iva: number, 
        public clave_sat: string, 
        public ieps: number, 
        public retencion_iva: number, 
        public retencion_isr: number, 
        public tipo_cambio: number, 
        public xml: string, 
        public cuentacontable: string,
        public id_concepto: number,
        public id_empresa: number,
        public id_movfactura?: number
    ) {
    }
}