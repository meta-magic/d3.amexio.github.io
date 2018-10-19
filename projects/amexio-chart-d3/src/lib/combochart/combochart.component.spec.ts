import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombochartComponent } from './combochart.component';

describe('CombochartComponent', () => {
  let component: CombochartComponent;
  let fixture: ComponentFixture<CombochartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombochartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombochartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
