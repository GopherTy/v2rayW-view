import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2rayComponent } from './v2ray.component';

describe('V2rayComponent', () => {
  let component: V2rayComponent;
  let fixture: ComponentFixture<V2rayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2rayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2rayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
