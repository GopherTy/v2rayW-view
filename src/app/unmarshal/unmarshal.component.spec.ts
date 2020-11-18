import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmarshalComponent } from './unmarshal.component';

describe('UnmarshalComponent', () => {
  let component: UnmarshalComponent;
  let fixture: ComponentFixture<UnmarshalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnmarshalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmarshalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
