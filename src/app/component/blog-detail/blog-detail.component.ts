import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent  implements OnInit{
  blogSlug: string | null = null;
  blog: any = null;
  image_get_url = environment.apiUrl;

  constructor(private route: ActivatedRoute, private blogSRV: BlogService){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{
      this.blogSlug = params['slug'];
      if(this.blogSlug){
        this.getAllBlogData(this.blogSlug);
      }
    })
  }

  getAllBlogData(slug: string): void{
    this.blogSRV.getBlogBySlug(slug).subscribe((res)=>{
      this.blog= res;
      console.log(this.blog);
    }, error=>{
      if(error.status === 404){
        this.blog = null;
      }else{
        console.log('error in blog-detail', error);
      }
    });
  }
}
