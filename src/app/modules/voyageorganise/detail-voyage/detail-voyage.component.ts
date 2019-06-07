import {Component, Inject, OnInit} from '@angular/core';
import {VoyageOrganise} from '../../../modeles/voyage/voyage-organise';
import {MAT_DIALOG_DATA} from '@angular/material';
import {PhotoService} from '../../../service/photo.service';
import {PhotoModel} from '../../../modeles/photo.model';


@Component({
  selector: 'app-detail-voyage',
  templateUrl: './detail-voyage.component.html',
  styleUrls: ['./detail-voyage.component.scss']
})
export class DetailVoyageComponent implements OnInit {

    newVoyage: VoyageOrganise;
    voyage: VoyageOrganise = new VoyageOrganise();
    id: number;
    reference: string;
    title: string;
    description: any;
    destination: string;
    Categories: any[];
    photos: any;
    visibleImages: PhotoModel[];
    url = 'http://localhost:8000/uploads/images/';

    constructor(@Inject(MAT_DIALOG_DATA) public data,
                private photoService: PhotoService) {
        this.newVoyage = this.data[0];
    }

    ngOnInit() {
        this.id = this.newVoyage.id;
        this.reference = this.newVoyage.reference;
        this.title = this.newVoyage.title;
        this.description = this.newVoyage.description;
        this.destination = this.newVoyage.destination;
        this.Categories = this.newVoyage.Categories;
        this.photos = this.newVoyage.photos;
        // this.getpicture();
    }

    //
    // getpicture() {
    //   this.photoService.getPhotos(this.id).subscribe( (data) => {
    //      this.photos = data.data;
    //   });
    // }
}

