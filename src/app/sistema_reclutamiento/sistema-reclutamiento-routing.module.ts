import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoCandidatosComponent } from './catalogo_candidato/cat_candidatos.component';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { CatalogoSucursalComponent } from './catalogo_sucursal/catalogo_sucursal.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcedimientoBajaComponent } from './procedimiento_baja/procedimiento_baja.component';
import { ProcedimientoContratacionComponent } from './procedimiento_contratacion/procedimiento_contratacion.component';
import { ProcedimientoModificacionComponent } from './procedimiento_modificacion/procedimiento_modificacion.component';
import { SistemaReclutamientoComponent } from './sistema-reclutamiento.component';
import { ProcedVacacionesComponent } from './proced_vacaciones/proced_vacaciones.component';
import { ProcedBitacoraComponent } from './proced-bitacora/proced-bitacora.component';
import { ProcedIncapacidadComponent } from './proced-incapacidad/proced-incapacidad.component';
import { CatalogoFestivosComponent } from './catalogo-festivos/catalogo-festivos.component';
import { CatalogoTurnosComponent } from './catalogo-turnos/catalogo-turnos.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { ProcedXmlComponent } from './proced-xml/proced-xml.component';
import { CalcularIncidenciasComponent } from './calcular-incidencias/calcular-incidencias.component';
import { ReporteIncidenciasComponent } from './reporte-incidencias/reporte-incidencias.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProcedAsignarTurnoComponent } from './proced-asignar-turno/proced-asignar-turno.component';

const routes: Routes = [
  {
    path : 'sistema_reclutamiento',
    component : SistemaReclutamientoComponent,
    children : [
        { path : "dashboard",component : DashboardComponent},
        { path : "asistencia",component : AsistenciaComponent},
        { path : "usuarios",component : UsuariosComponent},
        { path : "catalogo_candidato", component : CatalogoCandidatosComponent},
        { path : "catalogo_departamento", component : CatalogoDepartamentoComponent},
        { path : "catalogo_usuario", component : CatalogoUsuarioComponent},
        { path : "catalogo_empresa", component : CatalogoEmpresaComponent},
        { path : "catalogo_sucursal", component : CatalogoSucursalComponent},
        { path : "catalogo_festivos", component : CatalogoFestivosComponent},
        { path : "catalogo_turnos", component : CatalogoTurnosComponent},
        { path : "proced_vacaciones", component : ProcedVacacionesComponent},
        { path : "bitacora-insidencias", component : ProcedBitacoraComponent},
        { path : "proced_incapacidades", component : ProcedIncapacidadComponent},
        { path : "procedimiento_contratacion", component : ProcedimientoContratacionComponent},
        { path : "procedimiento_baja", component : ProcedimientoBajaComponent},
        { path : "procedimiento_modificacion", component : ProcedimientoModificacionComponent},
        { path : "proced_xml", component : ProcedXmlComponent},
        { path : "calcular_incidencia", component : CalcularIncidenciasComponent},
        { path : "reporte_incidencia", component : ReporteIncidenciasComponent},
        { path : "asignar_turno", component : ProcedAsignarTurnoComponent},
        // { path : "catalogo_cliente/:id", component : CatalogoClienteComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaReclutamientoRoutingModule { }
