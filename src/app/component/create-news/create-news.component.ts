import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AsideComponent } from '../aside/aside.component';
import { NewsService } from '../../services/news.service';
import { ToastrService } from 'ngx-toastr';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { SearchPipe } from "../../pipes/search.pipe";

@Component({
  selector: 'app-create-news',
  imports: [CommonModule, ReactiveFormsModule, AsideComponent, NgxEditorModule, SearchPipe, FormsModule],
  templateUrl: './create-news.component.html',
  styleUrl: './create-news.component.scss',
})
export class CreateNewsComponent implements OnInit {
  newsForm!: FormGroup;
  add_news!: boolean;
  edit_news!: boolean;
  popup_header: string = '';
  news_data: any[] = [];
  single_news_data: any;
  selectedFileName: string = '';
  selectedFile: File | null = null;
  selectedNewsId!: number;
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
    private fb: FormBuilder,
    private newsSRV: NewsService,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllNews();
    this.editor = new Editor();

    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getAllNews() {
    this.newsSRV.getNews().subscribe(
      (res) => {
        this.news_data = res;
      },
      (error) => {
        console.error('Error featching blog', error);
      }
    );
  }

  addNewsPopup() {
    this.add_news = true;
    this.edit_news = false;
    this.popup_header = 'Create News';
    this.newsForm.reset();
  }

  addNews() {
    if (this.newsForm.invalid) return;
    const formData = new FormData();
    formData.append('title', this.newsForm.value.title);
    formData.append('description', this.newsForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.newsSRV.createNews(formData).subscribe(
      () => {
        this.newsForm.reset();
        this.getAllNews();
        this.toster.success('Blog added successfully');
      },
      (error) => {
        console.error('Error creating blog', error);
        this.toster.error('Error creating blog');
      }
    );
  }

  editNews(news_id: any) {
    this.selectedNewsId = news_id;
    this.edit_news = true;
    this.add_news = false;
    this.popup_header = 'Update News';

    this.newsSRV.singleNews(this.selectedNewsId).subscribe((res) => {
      this.single_news_data = res;
      this.newsForm.patchValue({
        title: this.single_news_data.title,
        description: this.single_news_data.description,
      });
    });
  }

  udpateNews() {
    if (this.newsForm.invalid) return;
    const formData = new FormData();
    formData.append('title', this.newsForm.value.title);
    formData.append('description', this.newsForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.newsSRV.updateNews(this.selectedNewsId, formData).subscribe(
      () => {
        this.toster.success('blog udpate successfull');
        this.newsForm.reset();
        this.getAllNews();
      },
      (error) => {
        console.error('Error updating blog', error);
        this.toster.error('Error updating blog');
      }
    );
  }

  deleteNews(id: number) {
    let cnf = confirm('Are you sure this blog is deleted');
    if (cnf) {
      this.newsSRV.deleteNews(id).subscribe(
        () => {
          this.getAllNews();
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
}
