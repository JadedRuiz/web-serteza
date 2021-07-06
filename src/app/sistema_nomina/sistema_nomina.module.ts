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
import { MatNativeDateModule } from '@angular/material/core'; 
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [
    SistemaNominaComponent,
    DashboardComponent,
    CatalogoEmpleadoComponent,
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
  ]
})
export class SistemaNominaModule { }
