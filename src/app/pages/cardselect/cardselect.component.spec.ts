import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardselectComponent } from './cardselect.component';

describe('CardselectComponent', () => {
  let component: CardselectComponent;
  let fixture: ComponentFixture<CardselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardselectComponent]
    });
    fixture = TestBed.createComponent(CardselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
