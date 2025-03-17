import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../../services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private userSRV: UserService, 
    private router: Router, 
    private jwtHeleper: JwtHelperService,
    private toster: ToastrService,
  ){}
 ngOnInit(): void {
   
 }

 login(){
  this.userSRV.login(this.username, this.password).subscribe(
    (response: any) => {
      const token = response.token;
      localStorage.setItem('token', token);

      const decodedToken = this.jwtHeleper.decodeToken(token);
      const userRole = parseInt(decodedToken.roleId, 10);

      if (userRole === 1) {
        this.router.navigate(['/admin-dashboard']);
      } else if (userRole === 2) {
        this.router.navigate(['/user-dashboard']);
      } else {
        this.errorMessage = 'Unknown role!';
        this.toster.error(this.errorMessage);
      }
    },
    (error) => {
      this.errorMessage = 'Invalid username or password';
      this.toster.error(this.errorMessage);
    }
  );
 }
}
