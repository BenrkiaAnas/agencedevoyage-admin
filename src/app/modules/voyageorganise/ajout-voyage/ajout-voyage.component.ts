import {Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {VoyageOrganise} from '../../../modeles/voyage/voyage-organise';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {VoyageOrganiseService} from '../../../service/voyage-organise.service';
import {Categorie} from '../../../modeles/categorie/categorie';
import {CategorieService} from '../../../service/categorie.service';
import {PhotoModel} from '../../../modeles/photo.model';
import {HttpClient} from '@angular/common/http';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';

@Component({
  selector: 'app-ajout-voyage',
  templateUrl: './ajout-voyage.component.html',
  styleUrls: ['./ajout-voyage.component.scss']
})
export class AjoutVoyageComponent implements OnInit {
  message: string;
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  };
  reference: string;
  public loading = false;
  registerForm: FormGroup;
  registerForm1: FormGroup;
  action: any;
  newVoyage: VoyageOrganise;
  files: any[];
  idVoyage: number;
  referenceVoyage: string;
  secondFormGroup: FormGroup;
  isOptional = false;
  Categories = new FormControl();
  photos: PhotoModel[] = new Array<PhotoModel>();
  CategoriesList: Categorie[] = new Array<Categorie>();
  @ViewChild('filter') filter: ElementRef;
  displayedColumns: string[] = ['reference', 'destination', 'details', 'actions'];


  constructor(public dialogRef: MatDialogRef<AjoutVoyageComponent>,
              private voyageService: VoyageOrganiseService,
              private catgorieService: CategorieService,
              private formBuilder: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private snackBar: MatSnackBar,
              private http: HttpClient,
              private logService: LogService,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.newVoyage = new VoyageOrganise();
    this.newVoyage = this.data[0];
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      Categories: ['', [Validators.required]],
      // photos: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({});
    this.catgorieService.getAllCategories().subscribe(resp => {
      this.CategoriesList = resp.data;
    });
    this.registerForm1 = this.formBuilder.group({
      photos: ['']
    });
  }

  onClose() {
    this.registerForm.reset();
    this.dialogRef.close();
    this.voyageService.getAllVoyages();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.voyageService.addVoyage(this.registerForm.value)
        .subscribe(resp => {
          this.idVoyage = resp.id;
          this.referenceVoyage = resp.reference;
          this.log.action = 'Ajout du voyage qui a comme réference : ' + this.referenceVoyage;
          this.logService.enregisterLog(this.log).subscribe();
          this.voyageService.getAllVoyages();
        });
    }

  }

  onFileChange(event) {
    this.files = event.target.files;
  }

  onFileSelected(event) {
        if (this.files.length > 0) {
            for(let j = 0; j < this.files.length; j++) {
                const formData = new FormData();
                formData.append('image', this.files[j]);
                this.http.post('http://localhost:8000/voyage/photos/' + this.idVoyage, formData)
                    .subscribe(
                        (data) => {
                            this.voyageService.getAllVoyages();
                        }
                    );
            }
        }
  }

  valider() {
    this.onClose();
    this.voyageService.getAllVoyages().subscribe();
    this.toastr.success(' Ajout avec succes !', 'Succès', {positionClass: 'toast-top-center'});
    this.router.navigate(['/voyage']);
  }
}
