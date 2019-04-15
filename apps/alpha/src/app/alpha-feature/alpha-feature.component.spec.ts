import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaFeatureComponent } from './alpha-feature.component';

describe('AlphaFeatureComponent', () => {
  let component: AlphaFeatureComponent;
  let fixture: ComponentFixture<AlphaFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlphaFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
