import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInclusionComponent } from './list-inclusion.component';

describe('ListInclusionComponent', () => {
  let component: ListInclusionComponent;
  let fixture: ComponentFixture<ListInclusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInclusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
