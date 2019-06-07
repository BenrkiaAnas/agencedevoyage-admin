import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutVoyageComponent } from './ajout-voyage.component';

describe('AjoutVoyageComponent', () => {
  let component: AjoutVoyageComponent;
  let fixture: ComponentFixture<AjoutVoyageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutVoyageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutVoyageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
