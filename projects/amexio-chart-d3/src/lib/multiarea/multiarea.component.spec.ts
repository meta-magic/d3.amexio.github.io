import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiareaComponent } from './multiarea.component';

describe('MultiareaComponent', () => {
  let component: MultiareaComponent;
  let fixture: ComponentFixture<MultiareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
