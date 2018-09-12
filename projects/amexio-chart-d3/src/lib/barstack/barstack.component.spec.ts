import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarstackComponent } from './barstack.component';

describe('BarstackComponent', () => {
  let component: BarstackComponent;
  let fixture: ComponentFixture<BarstackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarstackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarstackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
