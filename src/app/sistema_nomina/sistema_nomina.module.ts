import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SistemaNominaComponent } from './sistema_nomina.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompartidoModule } from './compartido/compartido.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SistemaNominaRoutingModule } from './sistema_nomina.routes';
import { CatalogoEmpleadoComponent } from './catalogo_empleado/catalogo_empleado.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { WebcamModule } from 'ngx-webcam';
import { MatNativeDateModule } from '@angular/material/core'; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';
import { CatalogoConceptoComponent } from './catalogo_concepto/catalogo_concepto.component';
import { CatalogoPeriodoComponent } from './catalogo_periodo/catalogo_periodo.component';
import { CatalogoSucursalComponent } from './catalogo_sucursal/catalogo_sucursal.component';
import { CatalogoPrestacionComponent } from './catalogo_prestacion/catalogo_prestacion.component';
import { CatalogoCuentaBancariaComponent } from './catalogo_cuenta_bancaria/catalogo_cuenta_bancaria.component';
import { CatalogoRegistroPatronalComponent } from './catalogo_registro_patronal/catalogo_registro_patronal.component';
import { ProcedimientoSolicitudesComponent } from './procedimiento_solicitudes/procedimiento_solicitudes.component';
import { ProcedimientoCapturaComponent } from './procedimiento_captura/procedimiento_captura.component';
import { ProcedimientoCalculoComponent } from './procedimiento_calculo/procedimiento_calculo.component';
import { ProcedimientoCierreComponent } from './procedimiento_cierre/procedimiento_cierre.component';
import { ProcedimientoCotizacionComponent } from './procedimiento_cotizacion/procedimiento_cotizacion.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    SistemaNominaComponent,
    DashboardComponent,
    CatalogoEmpleadoComponent,
    CatalogoDepartamentoComponent,
    CatalogoConceptoComponent,
    CatalogoPeriodoComponent,
    CatalogoSucursalComponent,
    CatalogoPrestacionComponent,
    CatalogoCuentaBancariaComponent,
    CatalogoRegistroPatronalComponent,
    ProcedimientoSolicitudesComponent,
    ProcedimientoCapturaComponent,
    ProcedimientoCalculoComponent,
    ProcedimientoCotizacionComponent,
    ProcedimientoCierreComponent
  ],
  imports: [
    CompartidoModule,
    SistemaNominaRoutingModule,
    BrowserModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    WebcamModule,
    ChartsModule
  ]
})
export class SistemaNominaModule { }
