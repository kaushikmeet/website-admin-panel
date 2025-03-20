import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCasestudyComponent } from './create-casestudy.component';

describe('CreateCasestudyComponent', () => {
  let component: CreateCasestudyComponent;
  let fixture: ComponentFixture<CreateCasestudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCasestudyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCasestudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
