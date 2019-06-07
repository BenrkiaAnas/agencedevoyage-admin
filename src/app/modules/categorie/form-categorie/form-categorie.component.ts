import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {CategorieService} from '../../../service/categorie.service';
import {ToastrService} from 'ngx-toastr';
import {LogService} from '../../../service/log.service';
import {LogModel} from '../../../modeles/log.model';

@Component({
  selector: 'app-form-categorie',
  templateUrl: './form-categorie.component.html',
  styleUrls: ['./form-categorie.component.scss']
})
export class FormCategorieComponent implements OnInit {
  log: LogModel = {
        action: '',
        admin: localStorage.getItem('username'),
    }
  reference: string;
    referenceVoyage: string;
    registerForm: FormGroup;
  submitted = false;
  action: any;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: ['', []],
      label: ['', [Validators.required]]
    });
    if (this.action === 'Edit') {
      this.categorieEdit(this.data[0]);
    }
  }

  constructor(public dialogRef: MatDialogRef<FormCategorieComponent>,
              private service: CategorieService,
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
    // console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      if (this.action === 'Add') {
        this.service.addCategorie(this.registerForm.value).subscribe(
          res => {
            this.referenceVoyage = this.registerForm.value.label;
            this.log.action = 'Ajout du catégorie : ' + this.referenceVoyage;
            this.logService.enregisterLog(this.log).subscribe();
            this.onClose();
            this.service.getAllCategories();
            this.toastr.success( ' Ajouter avec succes !', 'Succès', {positionClass: 'toast-top-center'});
          });
      }
      if (this.action === 'Edit') {
        this.service.updateCategorie(this.registerForm.value).subscribe(
            res => {
          this.referenceVoyage = res.label;
          this.log.action = 'Modification du catégorie : ' + this.referenceVoyage;
          this.logService.enregisterLog(this.log).subscribe();
          this.onClose();
          this.service.getAllCategories();
          this.toastr.success( ' Modifier avec succes !', 'Succès', {positionClass: 'toast-top-center'});
        });
      }
      this.router.navigate(['/categorie']);

    }
  }

  categorieEdit(categorie) {
    this.registerForm.setValue({
      id: categorie.id,
      label: categorie.label
    });

  }



}
