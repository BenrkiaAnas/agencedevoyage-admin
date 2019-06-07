import {Component, Inject, OnInit} from '@angular/core';
import {Promo} from "../../../modeles/promotion/promo";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PlanningService} from "../../../service/planning.service";
import {HotelService} from "../../../service/hotel.service";
import {InclusionService} from "../../../service/inclusion.service";
import {VoyageOrganiseService} from "../../../service/voyage-organise.service";
import {PromoService} from "../../../service/promo.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-detail-promo',
  templateUrl: './detail-promo.component.html',
  styleUrls: ['./detail-promo.component.scss']
})
export class DetailPromoComponent implements OnInit {
  promoDetail: Promo;
  action: any;

  constructor(public dialogRef: MatDialogRef<DetailPromoComponent>,
              private service: PromoService,
              private toastr: ToastrService,
              private router: Router,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.promoDetail = this.data[0];
  }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}
