import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {VoyageorganiseModule} from '../voyageorganise.module';
import {VoyageOrganiseService} from '../../../service/voyage-organise.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../service/authentication.service';
import {VoyageOrganise} from '../../../modeles/voyage/voyage-organise';
import {
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialogRef
} from '@angular/material';
import {Categorie} from '../../../modeles/categorie/categorie';
import {CategorieService} from '../../../service/categorie.service';
import {ToastrService} from 'ngx-toastr';
import {PhotoService} from '../../../service/photo.service';
import {HttpClient} from '@angular/common/http';
import {PhotoModel} from '../../../modeles/photo.model';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';


@Component({
  selector: 'app-edit-voyage',
  templateUrl: './edit-voyage.component.html',
  styleUrls: ['./edit-voyage.component.scss']
})
export class EditVoyageComponent implements OnInit {
  registerForm: FormGroup;
  idVoyage: number;
  files: any[];
  newvoyage: VoyageOrganise;
  CategoriesList: Categorie[] = new Array<Categorie>();
  PhotosList: PhotoModel[] = new Array<PhotoModel>();
  photos: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isOptional = false;
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  };
  reference: string;
  referenceVoyage: string;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditVoyageComponent>,
              private voyageService: VoyageOrganiseService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private photoService: PhotoService,
              private toastr: ToastrService,
              private catgorieService: CategorieService,
              private logService: LogService,
              private authenticationService: AuthenticationService,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.newvoyage = new VoyageOrganise();
    this.newvoyage = this.data[0];

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      reference: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      destination: ['', Validators.required],
      Categories: ['', [Validators.required]]
    });
    this.secondFormGroup = this.formBuilder.group({});
    this.adminVoyage(this.data[0]);
    this.catgorieService.getAllCategories().subscribe(resp => {
      this.CategoriesList = resp.data;
    });
    this.catgorieService.removeCategoriesVoyage(this.newvoyage.id)
      .subscribe();
    this.photos = this.newvoyage.photos;
    this.voyageService.getPhotoOfVoyage(this.newvoyage.id)
      .subscribe(resp => {
        this.PhotosList = resp.data;
      });
  }

  adminVoyage(voyage: VoyageOrganise) {
    this.registerForm.setValue({
      // id: voyage.id,
      reference: voyage.reference,
      title: voyage.title,
      description: voyage.description,
      destination: voyage.destination,
      Categories: voyage.Categories
    });
  }

  isauthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  getcategies() {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.voyageService.updateVoyage(this.newvoyage.id, this.registerForm.value)
        .subscribe(resp => {
          this.referenceVoyage = resp.reference;
          this.log.action = 'Modification du voyage qui a comme réference : ' + this.referenceVoyage;
          this.logService.enregisterLog(this.log).subscribe();
        }, error1 => console.log(error1));
    }
  }

  onClose() {
    this.registerForm.reset();
    this.dialogRef.close();
  }

  deleteImage(id) {
    this.photoService.deletePhoto(id).subscribe(resp => {
      this.voyageService.getPhotoOfVoyage(this.newvoyage.id)
        .subscribe(data => {
          this.PhotosList = data.data;
        });
    });
  }

  onFileChange(event) {
    this.files = event.target.files;
  }

  onFileSelected(event) {
    if (this.files.length > 0) {
      for (let j = 0; j < this.files.length; j++) {
        const formData = new FormData();
        formData.append('image', this.files[j]);
        this.http.post('http://localhost:8000/voyage/photos/' + this.newvoyage.id, formData)
          .subscribe(
            (data) => {
            }
          );
      }
    }
  }

  valider() {
    this.onClose();
    this.toastr.success(' Modification avec succes !', 'Succès', {positionClass: 'toast-top-center'});
  }

  refresh() {
    setTimeout(
      () => {
        location.reload();
      }, 1000);
  }
}
