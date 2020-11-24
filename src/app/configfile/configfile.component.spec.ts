import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigfileComponent } from './configfile.component';

describe('ConfigfileComponent', () => {
  let component: ConfigfileComponent;
  let fixture: ComponentFixture<ConfigfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
