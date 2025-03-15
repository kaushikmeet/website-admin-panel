import { Component, OnInit } from '@angular/core';
import { RouterLink} from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
 allUserList: any;

  constructor(private userSRV: UserService){}
 ngOnInit(): void {
   
 }
}
