import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera/camera.component';
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    CommonModule,
    WebcamModule
  ],
  exports: [
    CameraComponent
  ]
})
export class CompartidoModuleGeneral { }
