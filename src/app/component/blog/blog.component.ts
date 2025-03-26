import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{
  blogs:any;

  constructor(private blogSRV: BlogService){}

  ngOnInit(): void {
    this.getAllBlogs();
  }
  getAllBlogs(){
    this.blogSRV.getBlogs().subscribe((res)=>{
      this.blogs = res;
    })
  }
}
