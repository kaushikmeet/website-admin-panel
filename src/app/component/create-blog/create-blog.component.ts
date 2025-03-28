import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsideComponent } from '../aside/aside.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { SearchPipe } from '../../pipes/search.pipe';

@Component({
  selector: 'app-create-blog',
  imports: [CommonModule, AsideComponent, ReactiveFormsModule, NgxEditorModule, FormsModule, SearchPipe],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.scss',
})
export class CreateBlogComponent implements OnInit, OnDestroy {
  blogForm!: FormGroup;
  blog_data: any[] = [];
  selectedFileName: string = '';
  selectedFile: File | null = null;
  selectedBlogId!: number;
  single_blog_data: any;
  popup_header!: string;
  add_blog!: boolean;
  edit_blog!: boolean;
  editorContent: string = ''; 
  searchTerm: string = ''; 
  image_get_url = environment.apiUrl;
  editor!: Editor;
  toolbar: Toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

  constructor(
    private blogSRV: BlogService,
    private toster: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllBlog();
    this.editor = new Editor();

    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event?.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }

  getAllBlog() {
    this.blogSRV.getBlogs().subscribe(
      (res) => {
        this.blog_data = res;
      },
      (error) => {
        console.error('Error featching blog', error);
      }
    );
  }

  addBlogPopup() {
    this.add_blog = true;
    this.edit_blog = false;
    this.popup_header = 'Create Blog';
    this.blogForm.reset();
  }

  addNewBlog() {
    if (this.blogForm.invalid) return;
    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('description', this.blogForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.blogSRV.createBlog(formData).subscribe(
      () => {
        this.blogForm.reset();
        this.getAllBlog();
        this.toster.success('Blog added successfully');
      },
      (error) => {
        console.error('Error creating blog', error);
        this.toster.error('Error creating blog');
      }
    );
  }

  editBlog(blog_id: any) {
    this.selectedBlogId = blog_id;
    this.edit_blog = true;
    this.add_blog = false;
    this.popup_header = 'Update Blog';

    this.blogSRV.singleBlog(this.selectedBlogId).subscribe((res) => {
      this.single_blog_data = res;
      this.blogForm.patchValue({
        title: this.single_blog_data.title,
        description: this.single_blog_data.description
      });
    });
  }

  udpateBlog() {
    if (this.blogForm.invalid) return;
    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('description', this.blogForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.blogSRV.updateBlog(this.selectedBlogId, formData).subscribe(
      () => {
        this.toster.success('blog udpate successfull');
        this.blogForm.reset();
        this.getAllBlog();
      },
      (error) => {
        console.error('Error updating blog', error);
        this.toster.error('Error updating blog');
      }
    );
  }

  deleteBlog(id: number) {
    let cnf = confirm('Are you sure this blog is deleted');

    if (cnf) {
      this.blogSRV.deleteBlog(id).subscribe(
        () => {
          this.getAllBlog();
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
