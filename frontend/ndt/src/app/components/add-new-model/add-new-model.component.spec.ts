import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewModelComponent } from './add-new-model.component';

describe('AddNewModelComponent', () => {
  let component: AddNewModelComponent;
  let fixture: ComponentFixture<AddNewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
