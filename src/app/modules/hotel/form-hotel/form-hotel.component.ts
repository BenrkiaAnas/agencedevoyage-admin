import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HotelService} from '../../../service/hotel.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Hotel} from '../../../modeles/hotel/hotel';
import {Router} from '@angular/router';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-form-hotel',
  templateUrl: './form-hotel.component.html',
  styleUrls: ['./form-hotel.component.scss']
})
export class FormHotelComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  action: any;
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  };
  reference: string;
  referenceVoyage: string;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: ['', []],
      name: ['', [Validators.required, Validators.minLength(3)]],
      rating: ['', [Validators.required]]
    });
    if (this.action === 'Modifier') {
      this.hotelEdit(this.data[0]);
    }
  }

  constructor(public dialogRef: MatDialogRef<FormHotelComponent>,
              private service: HotelService,
              private toastr: ToastrService,
              private router: Router,
              private logService: LogService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.action = this.data[1].action;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose() {
    this.registerForm.reset();
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.action === 'Ajouter') {
        this.referenceVoyage = this.registerForm.value.name;
        this.service.addHotel(this.registerForm.value).subscribe(
          res => {
            this.service.getAllHotels();
            this.log.action = 'Ajout Hôtel : ' + this.referenceVoyage;
            this.logService.enregisterLog(this.log).subscribe();
            this.toastsNotification(res['code'], this.action, res['message']);
          }
        );
      }
      if (this.action === 'Modifier') {
        this.referenceVoyage = this.registerForm.value.name;
        this.service.updateHotel(this.registerForm.value).subscribe(res => {
          this.service.getAllHotels();
          this.log.action = 'Modification Hôtel : ' + this.referenceVoyage;
          this.logService.enregisterLog(this.log).subscribe();
          this.toastsNotification(res['code'], this.action, res['message']);

        });
      }
      this.onClose();
      this.router.navigate(['/hotels']);

    }
  }

  hotelEdit(hotel) {
    this.registerForm.setValue({
      id: hotel.id,
      name: hotel.name,
      rating: hotel.rating
    });

  }

  toastsNotification(code, titre, message) {
    if (code === 1) {
      this.toastr.success(message, titre, {positionClass: 'toast-top-center'});
    } else if (code === 2) {
      this.toastr.warning(message, titre, {positionClass: 'toast-top-center'});
    } else if (code === -1) {
      this.toastr.error(message, titre, {positionClass: 'toast-top-center'});
    }
  }
}
