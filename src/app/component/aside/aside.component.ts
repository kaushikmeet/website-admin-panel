import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-aside',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent implements OnInit {
 isAdmin: boolean = false;
 get_user_id: any;
 userData: any = {};  
 roleName: string = '';  

 constructor(
  private roleSrv: RoleService, 
  private usrSRV: UserService, 
  private router: Router){}
 ngOnInit(): void {
  this.getUser(5);
  const userRole = this.roleSrv.getUserRole();
  console.log(userRole);
  this.isAdmin = userRole === 1;
 }

 getUser(user_id: number){
  //this.get_user_id = user_id;
  this.usrSRV.getUser(user_id).subscribe((res)=>{
    this.userData = res;
  }, error=>{
    console.error('get user eeror', error);
  })
 }
 
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}
