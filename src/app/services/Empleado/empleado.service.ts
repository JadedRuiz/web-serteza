import { Injectable } from '@angular/core';
import { SERVER_CP } from 'src/config/config';
import { Empleado } from 'src/app/models/empleado';
import { Direccion} from 'src/app/models/Direccion';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  public Empleados = [
    {
      numero_empleado: 356,
      apellido_paterno: "Ruiz",
      apellido_materno: "Pech",
      nombre: "Jaded",
      rfc: "RUPJ951215MY0",
      curp: "RUPJ951215HYNZCD02",
      numero_seguro: "5654-2",
      fecha_nacimiento: "1995-12-15",
      edad: 25,
      lugar_nacimiento: "Mérida, Yúcatan, México",
      correo: "razonable3500@gmail.com",
      telefono_1: "9992716485",
      telefono_2: "9992113012",
      telefono_3: "",
      descripcion: "Ing en sistemas.",
      direccion: [{
        calle: 36,
        num_exterior: "397a",
        num_interior: "",
        cruzamiento_ext: "43",
        cruzamiento_int: "45",
        codigo_postal: "97144",
        colonia: "Emiliano Zapata Oriente",
        localidad: "",
        municipio: "Mérida",
        estado: "Yucatan",
        descripcion : "rejas negras"
      }]
    },
    {
      numero_empleado: 567,
      apellido_paterno: "Cauich",
      apellido_materno: "Navarro",
      nombre: "Juan Alberto",
      rfc: "NACJ122345MY1",
      curp: "NACJ122345HYNZCD02",
      numero_seguro: "5487-2",
      fecha_nacimiento: "12/11/1996",
      edad: 24,
      lugar_nacimiento: "Cancun, Quintana Roo, México",
      correo: "prueba.01@gmail.com",
      telefono_1: "9992716485",
      telefono_2: "9992113012",
      telefono_3: "",
      descripcion: "Arquitecto.",
      direccion: [{
        calle: 36,
        num_exterior: "397a",
        num_interior: "",
        cruzamiento_ext: "43",
        cruzamiento_int: "45",
        codigo_postal: "97144",
        colonia: "Emiliano Zapata Oriente",
        localidad: "",
        municipio: "Mérida",
        estado: "Yucatan",
        descripcion : "rejas negras"
      }]
    },
    {
      numero_empleado: 343,
      apellido_paterno: "Dzul",
      apellido_materno: "Can",
      nombre: "Sebastian Yatra",
      rfc: "CADS121294MY1",
      curp: "CADS121294HYNZCD02",
      numero_seguro: "8965-8",
      fecha_nacimiento: "12/12/1994",
      edad: 26,
      lugar_nacimiento: "Mérida, Yúcatan, México",
      correo: "prueba.02@gmail.com",
      telefono_1: "9992716485",
      telefono_2: "9992113012",
      telefono_3: "",
      descripcion: "Diseñador",
      direccion: [{
        calle: 36,
        num_exterior: "397a",
        num_interior: "",
        cruzamiento_ext: "43",
        cruzamiento_int: "45",
        codigo_postal: "97144",
        colonia: "Emiliano Zapata Oriente",
        localidad: "",
        municipio: "Mérida",
        estado: "Yucatan",
        descripcion : "rejas negras"
      }]
    },
    {
      numero_empleado: 231,
      apellido_paterno: "Dzul",
      apellido_materno: "Can",
      nombre: "Humberto Joel",
      rfc: "CADS121294MY1",
      curp: "CADS121294HYNZCD02",
      numero_seguro: "8965-8",
      fecha_nacimiento: "12/12/1994",
      edad: 26,
      lugar_nacimiento: "Mérida, Yúcatan, México",
      correo: "prueba.02@gmail.com",
      telefono_1: "9992716485",
      telefono_2: "9992113012",
      telefono_3: "",
      descripcion: "Ing en mecanica.",
      direccion: [{
        calle: 36,
        num_exterior: "397a",
        num_interior: "",
        cruzamiento_ext: "43",
        cruzamiento_int: "45",
        codigo_postal: "97144",
        colonia: "Emiliano Zapata Oriente",
        localidad: "",
        municipio: "Mérida",
        estado: "Yucatan",
        descripcion : "rejas negras"
      }]
    },
    {
      numero_empleado: 501,
      apellido_paterno: "Dzul",
      apellido_materno: "Can",
      nombre: "Javier Enrique",
      rfc: "CADS121294MY1",
      curp: "CADS121294HYNZCD02",
      numero_seguro: "8965-8",
      fecha_nacimiento: "12/12/1994",
      edad: 26,
      lugar_nacimiento: "Mérida, Yúcatan, México",
      correo: "prueba.02@gmail.com",
      telefono_1: "9992716485",
      telefono_2: "9992113012",
      telefono_3: "",
      descripcion: "Ing en plataformas.",
      direccion: [{
        calle: 36,
        num_exterior: "397a",
        num_interior: "",
        cruzamiento_ext: "43",
        cruzamiento_int: "45",
        codigo_postal: "97144",
        colonia: "Emiliano Zapata Oriente",
        localidad: "",
        municipio: "Mérida",
        estado: "Yucatan",
        descripcion : "rejas negras"
      }]
    }
  ]
  direccion : Direccion = new Direccion(0,"","","","","","","","","","");
  empleado : Empleado = new Empleado(0,"","","","","","","",0,"","","","","","",this.direccion);
  constructor() { }
  getEmpleados(){
    return this.Empleados;
  }
  getEmpleadosById(numero_empleado : number){
  let direccion_nueva;
  let empleado_nuevo;
    for(let i=0; i<this.Empleados.length;i++){
      if(this.Empleados[i].numero_empleado == numero_empleado){
        direccion_nueva = new Direccion(
          this.Empleados[i].direccion[0].calle,
          this.Empleados[i].direccion[0].num_exterior,
          this.Empleados[i].direccion[0].num_interior,
          this.Empleados[i].direccion[0].cruzamiento_ext,
          this.Empleados[i].direccion[0].cruzamiento_int,
          this.Empleados[i].direccion[0].codigo_postal,
          this.Empleados[i].direccion[0].colonia,
          this.Empleados[i].direccion[0].localidad,
          this.Empleados[i].direccion[0].municipio,
          this.Empleados[i].direccion[0].estado,
          this.Empleados[i].direccion[0].descripcion
        );
        empleado_nuevo = new Empleado(
          this.Empleados[i].numero_empleado,
          this.Empleados[i].apellido_paterno,
          this.Empleados[i].apellido_materno,
          this.Empleados[i].nombre,
          this.Empleados[i].rfc,
          this.Empleados[i].curp,
          this.Empleados[i].numero_seguro,
          this.Empleados[i].fecha_nacimiento,
          this.Empleados[i].edad,
          this.Empleados[i].lugar_nacimiento,
          this.Empleados[i].correo,
          this.Empleados[i].telefono_1,
          this.Empleados[i].telefono_2,
          this.Empleados[i].telefono_3,
          this.Empleados[i].descripcion,
          direccion_nueva
        );
        return empleado_nuevo;
      }
    }
    return this.empleado;
  }
}
