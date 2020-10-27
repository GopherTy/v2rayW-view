import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubconfigComponent } from './subconfig.component';

describe('SubconfigComponent', () => {
  let component: SubconfigComponent;
  let fixture: ComponentFixture<SubconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
