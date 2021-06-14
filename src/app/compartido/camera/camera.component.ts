import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  @Input() messageError : string;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public foto_user : any;

  constructor() { 
    this.messageError = "Este dispositivo no cuenta con una camara disponible";
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    });
  }
  
  takeSnapshot(): void {
    let foto = this.trigger.next();
    return this.foto_user;
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    // this.showWebcam = false;
    this.foto_user = webcamImage.imageAsDataUrl;
    // let docB64 = this.foto_user.split(",");
    // this.fotografia.docB64 = docB64[1];
    // this.fotografia.extension = "jpeg";
    // this.fotografia.nombre = "foto_user";
    // this.cerrarModalCamera();
    // console.log(webcamImage.imageAsDataUrl)
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
