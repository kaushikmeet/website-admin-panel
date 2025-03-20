import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSliderComponent } from './create-slider.component';

describe('CreateSliderComponent', () => {
  let component: CreateSliderComponent;
  let fixture: ComponentFixture<CreateSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
