import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './login/registro.component';
import { SistemaAdminModule } from './sistema_admin/sistema-admin.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SistemaReclutamientoModule } from './sistema_reclutamiento/sistema-reclutamiento.module';
import { SistemaSuperAdminModule } from './sistema_super_admin/sistema_super_admin.module';
import { SitemaPrestasoftModule } from './sistema_prestasoft/sistema_prestasoft.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SistemaAdminModule,
    SistemaSuperAdminModule,
    SistemaReclutamientoModule,
    SitemaPrestasoftModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NoopAnimationsModule
    
    
  ],
  providers: [
    CookieService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
