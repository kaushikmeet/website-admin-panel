import { Component, OnInit } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AsideComponent, CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  totalUsers: any;
  totalBlogs: any;
  totalNews: any;
  currentDateTime!: string;

  constructor(private dashboardSRV: DashboardService){}

  ngOnInit(): void {
    this.dashboardSRV.getUserCount().subscribe((res)=>{
       this.totalUsers = res.total_users;
    });
    this.dashboardSRV.getNewsCount().subscribe((res)=>{
      this.totalNews = res.total_news;
   });
   this.dashboardSRV.getBlogsCount().subscribe((res)=>{
    this.totalBlogs = res.total_blogs;
   });

   this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString();
  }
  
}
