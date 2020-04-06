import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoresComponent } from './pores.component';

describe('PoresComponent', () => {
  let component: PoresComponent;
  let fixture: ComponentFixture<PoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
