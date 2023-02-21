import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalContratoComponent } from './modal-contrato/modal_contrato.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ModalContratoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalContratoComponent
  ]
})
export class ComponentesModule { }
