import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediareComponent } from './intermediare.component';

describe('IntermediareComponent', () => {
  let component: IntermediareComponent;
  let fixture: ComponentFixture<IntermediareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntermediareComponent]
    });
    fixture = TestBed.createComponent(IntermediareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
