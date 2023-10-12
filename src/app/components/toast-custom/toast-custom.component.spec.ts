import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastCustomComponent } from './toast-custom.component';

describe('ToastCustomComponent', () => {
  let component: ToastCustomComponent;
  let fixture: ComponentFixture<ToastCustomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastCustomComponent]
    });
    fixture = TestBed.createComponent(ToastCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
