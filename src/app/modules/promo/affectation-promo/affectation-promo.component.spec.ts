import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationPromoComponent } from './affectation-promo.component';

describe('AffectationPromoComponent', () => {
  let component: AffectationPromoComponent;
  let fixture: ComponentFixture<AffectationPromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectationPromoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
