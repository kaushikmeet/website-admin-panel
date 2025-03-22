import { Component, OnInit } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  imports: [AsideComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent implements OnInit{
  all_users: any;
  single_user_id: any;
  single_user_data: any;
  updateUserForm!: FormGroup;
  userData: any;

  constructor(
    private userSRV: UserService, 
    private toster: ToastrService,
    private fb: FormBuilder){}

  ngOnInit(): void {
    this.users();
    this.updateUserForm= this.fb.group({
      username: ['', Validators.required],
      roleName: ['', Validators.required]
    });
  }
  users(){
    this.userSRV.getAllUser().subscribe((res)=>{
      this.all_users = res;
    });
  }

  editUser(user_id: number){
    this.single_user_id = user_id;
    this.userSRV.singleUser(this.single_user_id).subscribe((res)=>{
      this.single_user_data = res;
       this.updateUserForm.patchValue({
        username: this.single_user_data.username,
        roleName: this.single_user_data.name
       });
    }, errror=>{
      console.error('error in user', errror);
    })
  }

  updateUser(){
    if(this.updateUserForm.invalid) return;
    this.userSRV.updateUser(this.single_user_id, this.updateUserForm.value).subscribe(()=>{
      this.toster.success('user update successfull');
      this.users();
    }, error=>{
      console.log('error in user', error);
      this.toster.error('user not update');
    })
  }

  deleteUser(id: number){
    let cnf = confirm('Are you sure this blog is deleted');

    if (cnf) {
      this.userSRV.deleteUser(id).subscribe(
        () => {
          this.users();
          this.toster.success('Blog deleted successfully');
        },
        (error) => {
          console.error('Error deleting blog', error);
        }
      );
    } else {
      this.toster.show('blog is not deleted');
    }
  }
}
