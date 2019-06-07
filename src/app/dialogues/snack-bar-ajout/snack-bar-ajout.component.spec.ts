import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarAjoutComponent } from './snack-bar-ajout.component';

describe('SnackBarAjoutComponent', () => {
  let component: SnackBarAjoutComponent;
  let fixture: ComponentFixture<SnackBarAjoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackBarAjoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
