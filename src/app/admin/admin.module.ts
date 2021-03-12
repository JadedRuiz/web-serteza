import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CompartidoModule } from '../compartido/compartido.module';
import { AdminRoutingModule } from './admin.routes';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { RhModule } from 'src/app/admin/recursos_humanos/rh.module';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CompartidoModule,
    AdminRoutingModule,
    BrowserModule,
    RouterModule,
    RhModule
  ],
  exports : [
    AdminComponent
  ]
})
export class AdminModule { }
