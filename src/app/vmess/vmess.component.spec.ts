import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmessComponent } from './vmess.component';

describe('VmessComponent', () => {
  let component: VmessComponent;
  let fixture: ComponentFixture<VmessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
