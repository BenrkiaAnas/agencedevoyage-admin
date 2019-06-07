import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInclusionComponent } from './form-inclusion.component';

describe('FormInclusionComponent', () => {
  let component: FormInclusionComponent;
  let fixture: ComponentFixture<FormInclusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInclusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
