import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompartidoModule } from './compartido/compartido.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SistemaControlRoutingModule } from './sistema_bitacora.routes';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core'; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import { SistemaControlComponent } from './sistema_bitacora.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    SistemaControlComponent,
    DashboardComponent,
  ],
  imports: [
    CompartidoModule,
    SistemaControlRoutingModule,
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
    ChartsModule
  ]
})
export class SistemaBitacoraModule { }
