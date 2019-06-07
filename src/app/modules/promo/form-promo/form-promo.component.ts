import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef, MatRadioChange} from "@angular/material";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {PromoService} from "../../../service/promo.service";
import {LogModel} from "../../../modeles/log.model";
import {LogService} from "../../../service/log.service";
import {MatDatepickerInputEvent} from "@angular/material/typings/esm5/datepicker";

@Component({
  selector: 'app-form-promo',
  templateUrl: './form-promo.component.html',
  styleUrls: ['./form-promo.component.scss']
})
export class FormPromoComponent implements OnInit {
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  }
  reference: string;
  referencePromo: string;
  registerForm: FormGroup;
  submitted = false;
  action: any;
  changeType = false;
  etatUsingDate = false;
  minDate ;



  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: ['', []],
      label: ['', [Validators.required]],
      pourcentage: ['', [Validators.required]],
      dateBegin: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
      typePromo: ['stable', []],
        nbrPersonne : [,[]]
    });


    if (this.action === 'Modifier') {
      this.promoEdit(this.data[0]);
    }


  }
  constructor(public dialogRef: MatDialogRef<FormPromoComponent>,
              private service: PromoService,
              private router: Router,
              private toastr: ToastrService,
              private formBuilder: FormBuilder,
              private logService: LogService,
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
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      if (this.action === 'Ajouter') {
        this.service.addPromo(this.registerForm.value).subscribe(
            res => {
              this.referencePromo = this.registerForm.value.label + " du promotion : "+this.registerForm.value.pourcentage+" %";
              this.log.action = 'Ajout du promotion : ' + this.referencePromo;
              this.logService.enregisterLog(this.log).subscribe();
              this.onClose();
              this.service.getAllPromo();
              this.toastr.success(' Ajouter avec succes ! !', 'Succès', {positionClass: 'toast-top-center'});
            }
        );
      }
      if (this.action === 'Modifier') {
        this.service.updatePromo(this.registerForm.value).subscribe(res => {
          this.referencePromo = this.registerForm.value.pourcentage;
          this.log.action = this.registerForm.value.label + " du promotion : "+this.registerForm.value.pourcentage+" %";
          this.logService.enregisterLog(this.log).subscribe();
          this.onClose();
          this.service.getAllPromo();
          this.toastr.success(' Modification avec succes ! !', 'Succès', {positionClass: 'toast-top-center'});

        });
      }
      this.router.navigate(['/promotion']);

    }
  }
  promoEdit(promo)
  {
    this.registerForm.setValue({
      id : promo.id,
      label : promo.label,
      pourcentage : promo.pourcentage,
      dateBegin : promo.dateBegin,
      dateEnd : promo.dateEnd,
      typePromo : promo.typePromo,
      nbrPersonne : promo.nbrPersonne,
    });
  }
    radioChange($event: MatRadioChange){
     if($event.value == "special")
     {
         this.changeType = true;
     }else{
         this.changeType = false;
         this.registerForm.controls.nbrPersonne.setValue(0);
     }
    }
    valueChangeDate($event:MatDatepickerInputEvent<Date>)
    {
        this.etatUsingDate = true;
        this.minDate = $event.value;
        let elem = document.getElementById("inpyDate");
        elem.removeAttribute('readonly');
    }


}
