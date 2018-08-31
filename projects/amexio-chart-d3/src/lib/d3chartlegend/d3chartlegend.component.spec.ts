import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3chartlegendComponent } from './d3chartlegend.component';

describe('D3chartlegendComponent', () => {
  let component: D3chartlegendComponent;
  let fixture: ComponentFixture<D3chartlegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3chartlegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3chartlegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
