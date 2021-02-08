import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RecursosHumanosComponent } from './recursos_humanos/recursos_humanos.component';
import { CompartidoModule } from '../compartido/compartido.module';
import { AdminRoutingModule } from './admin.routes';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RecursosHumanosComponent,
    AdminComponent
  ],
  imports: [
    CompartidoModule,
    AdminRoutingModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports : [
    RecursosHumanosComponent
  ]
})
export class AdminModule { }
