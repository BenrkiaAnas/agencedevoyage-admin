import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlanningComponent } from './detail-planning.component';

describe('DetailPlanningComponent', () => {
  let component: DetailPlanningComponent;
  let fixture: ComponentFixture<DetailPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
