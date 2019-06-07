import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {InclusionService} from '../../../service/inclusion.service';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-form-inclusion',
  templateUrl: './form-inclusion.component.html',
  styleUrls: ['./form-inclusion.component.scss']
})
export class FormInclusionComponent implements OnInit {
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  };
  reference: string;
  referenceVoyage: string;
  registerForm: FormGroup;
  action: any;
  arrayIcon = ['wifi', 'perm_scan_wifi', 'airline_seat_...', 'camera_enhance', 'room_service', 'free_breakfast', 'local_bar', 'restaurant_menu',
    'restaurant', 'hotel', 'rowing', 'timeline', 'translate', 'work_outline', 'work', 'work_off', 'videocam', 'videocam_off', 'waves',
    'weekend', 'pool', 'golf_course', 'airplanemode_active', 'airplanemode_active', 'airplanemode_inactive', 'headset', 'headset_mic',
    'spa', 'beach_access', 'ac_unit', 'filter_hdr', 'filter_frames', 'filter_vintage', 'flare', 'airline_seat_recline_extra',
    'airline_seat_recline_normal'];

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: ['', []],
      label: ['', [Validators.required]],
      icon: ['', [Validators.required]]
    });
    if (this.action === 'Modifier') {
      this.inclusionEdit(this.data[0]);
    }
  }

  constructor(public dialogRef: MatDialogRef<FormInclusionComponent>,
              private service: InclusionService,
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
      this.referenceVoyage = this.registerForm.value.label;
      if (this.action === 'Ajouter') {
        this.service.addInclusion(this.registerForm.value).subscribe(
          res => {
            this.log.action = 'Inclusion ' + this.referenceVoyage + ' ajouté ';
            this.logService.enregisterLog(this.log).subscribe();
            this.service.getAllInclusions();
            this.toastsNotification(res['code'], this.action, res['message']);
          }
        );
      }
      if (this.action === 'Modifier') {
        this.service.updateInclusion(this.registerForm.value).subscribe(res => {
          this.log.action = 'Inclusion ' + this.referenceVoyage + ' modifié ';
          this.logService.enregisterLog(this.log).subscribe();
          this.service.getAllInclusions();
          this.toastsNotification(res['code'], this.action, res['message']);
        });
      }
      this.onClose();
      this.router.navigate(['/inclusion']);

    }
  }

  inclusionEdit(inclusion) {
    this.registerForm.setValue({
      id: inclusion.id,
      label: inclusion.label,
      icon: inclusion.icon
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
