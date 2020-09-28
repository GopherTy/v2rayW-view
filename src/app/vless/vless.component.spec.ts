import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlessComponent } from './vless.component';

describe('VlessComponent', () => {
  let component: VlessComponent;
  let fixture: ComponentFixture<VlessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
