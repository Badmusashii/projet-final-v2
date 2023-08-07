import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformdetailComponent } from './platformdetail.component';

describe('PlatformdetailComponent', () => {
  let component: PlatformdetailComponent;
  let fixture: ComponentFixture<PlatformdetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformdetailComponent]
    });
    fixture = TestBed.createComponent(PlatformdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
