import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PlanningService} from '../../../service/planning.service';
import {HotelService} from '../../../service/hotel.service';
import {InclusionService} from '../../../service/inclusion.service';
import {VoyageOrganiseService} from '../../../service/voyage-organise.service';
import {PromoService} from '../../../service/promo.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {Planning} from '../../../modeles/planning/planning';

@Component({
  selector: 'app-detail-planning',
  templateUrl: './detail-planning.component.html',
  styleUrls: ['./detail-planning.component.scss']
})
export class DetailPlanningComponent implements OnInit {

  planningDetail: Planning
  action: any;

  constructor(public dialogRef: MatDialogRef<DetailPlanningComponent>,
              private service: PlanningService,
              private hotelService: HotelService,
              private inclusionService: InclusionService,
              private voyageService: VoyageOrganiseService,
              private promoSevice: PromoService,
              private toastr: ToastrService,
              private router: Router,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.planningDetail = this.data[0];
  }

  ngOnInit() {
    // this.planningDetail = this.data[0];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}
