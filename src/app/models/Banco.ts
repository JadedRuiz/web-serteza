export class Banco {

    constructor(
        public id_catbanco : number,
        public id_empresa : number,
        public id_bancosat : number,
        public cuenta : String,
        public tarjeta : String,
        public clabe : String,
        public contrato : String,
        public cuentacontable : String,
        public descripcion : String,
        public usuario_creacion : number
    ){}
}
