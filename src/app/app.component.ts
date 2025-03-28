import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'admin-panel';

  constructor(private authSRV: AuthService){}
  
  ngOnInit(): void {
    if(this.authSRV.isAuthenticated()){
      const token = localStorage.getItem('token');
      if(token){
        this.authSRV.login(token);
      }
    }
  }
}
