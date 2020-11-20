import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowsocksComponent } from './shadowsocks.component';

describe('ShadowsocksComponent', () => {
  let component: ShadowsocksComponent;
  let fixture: ComponentFixture<ShadowsocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShadowsocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowsocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
