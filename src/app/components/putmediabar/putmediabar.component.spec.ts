import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutmediabarComponent } from './putmediabar.component';

describe('PutmediabarComponent', () => {
  let component: PutmediabarComponent;
  let fixture: ComponentFixture<PutmediabarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PutmediabarComponent]
    });
    fixture = TestBed.createComponent(PutmediabarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
