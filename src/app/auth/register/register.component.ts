import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { User } from '../../model/user';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
userForm!: FormGroup;
roles: string[] = ['Admin', 'Editor'];
userList: any;
user_detail!: User;
user_data: any;

constructor(private fb: FormBuilder, private userSRV: UserService, private toster: ToastrService){}

 ngOnInit(): void {
   this.userForm = this.fb.group({
    username: [''],
      password: [''],
      email: [''],
      roles: this.fb.array([])
   });
  //  this.getAllUser();
   
 }

//  getAllUser(){
//   this.userSRV.getUser().subscribe((data)=>{
//      this.userList = data;
//      console.log(this.userList);
//   }, error=>{
//     console.error('My error', error);
//     this.toster.error('Error in api');
//   })
//  }

onSubmit(){
  this.user_data = this.userForm.value;
  this.user_detail={
    username: this.user_data.username,
    email: this.user_data.email,
    password: this.user_data.password,
    roles: this.user_data.roles
  }
  this.userSRV.createUser(this.user_detail).subscribe((data)=>{
    this.user_data = data;
    console.log(this.user_data);
  })
}

get rolesFormArray() {
  return this.userForm.get('roles') as FormArray;
}

onRoleChange(role: string, event: any) {
  const rolesArray = this.rolesFormArray;
  if (event.target.checked) {
    rolesArray.push(this.fb.control(role));  // Add role to FormArray when checked
  } else {
    // Remove role from FormArray when unchecked
    const index = rolesArray.controls.findIndex(ctrl => ctrl.value === role);
    rolesArray.removeAt(index);
  }
}


}
