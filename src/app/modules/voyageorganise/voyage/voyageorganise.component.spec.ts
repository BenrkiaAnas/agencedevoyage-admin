import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageorganiseComponent } from './voyageorganise.component';

describe('VoyageorganiseComponent', () => {
  let component: VoyageorganiseComponent;
  let fixture: ComponentFixture<VoyageorganiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoyageorganiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoyageorganiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
