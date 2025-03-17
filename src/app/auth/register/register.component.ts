import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
userForm!: FormGroup;


constructor(
  private fb: FormBuilder, 
  private router: Router, 
  private userSRV: UserService, 
  private toster: ToastrService){}

 ngOnInit(): void {
   this.userForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleId: [1, Validators.required],
   });
 }

onSubmit(): void {
  if (this.userForm.valid) {
    this.userSRV.register(this.userForm.value).subscribe({
      next: (res) => {
        console.log(res);
        console.log('User registered successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error registering user:', err);
      },
    });
  }
}

}
