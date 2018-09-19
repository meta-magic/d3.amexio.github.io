import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupbarComponent } from './groupbar.component';

describe('GroupbarComponent', () => {
  let component: GroupbarComponent;
  let fixture: ComponentFixture<GroupbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
