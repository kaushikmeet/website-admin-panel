import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-blog',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{
  blogs:any[] = [];
  image_get_url = environment.apiUrl;
  blogSlug: any;
  
  constructor(
    private blogSRV: BlogService, 
    private router: Router){}

  ngOnInit(): void {
      this.getAllBlogs();
  }
  getAllBlogs(){
    this.blogSRV.getBlogs().subscribe((res: any[])=>{
      this.blogs = res;
    });
  }

  goToBlogDetail(slug: string) : void{
    this.router.navigate(['/blogs'], { queryParams: { slug: slug } });
  }

}
