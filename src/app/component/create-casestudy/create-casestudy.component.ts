import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CasestudyService } from '../../services/casestudy.service';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from '../../pipes/search.pipe';

@Component({
  selector: 'app-create-casestudy',
  imports: [AsideComponent, ReactiveFormsModule, NgxEditorModule, CommonModule, FormsModule, SearchPipe],
  templateUrl: './create-casestudy.component.html',
  styleUrl: './create-casestudy.component.scss'
})
export class CreateCasestudyComponent implements OnInit, OnDestroy{
  caseStudyForm!: FormGroup;
  case_study_data: any[] = [];
  selectedFileName: string = '';
  selectedFile: File | null = null;
  selectedCaseStudyId!: number;
  single_CaseStudy_data: any;
  popup_header!: string;
  add_case_study!: boolean;
  edit_case_study!: boolean;
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
    private caseStudySRV: CasestudyService, 
    private fb: FormBuilder, 
    private toster: ToastrService){}

  ngOnInit(): void {
    this.getAllCaseStudy();
    this.editor = new Editor();
     
    this.caseStudyForm= this.fb.group({
      title: ['', Validators.required],
      description:['', Validators.required]
    })
  }

  getAllCaseStudy(){
    this.caseStudySRV.getCaseStudy().subscribe((res)=>{
      this.case_study_data = res;
    }, error=>{
      console.log('error in case study api', error);
    })
  }

  addCaseStudyPopup(){
    this.popup_header = 'Add Case Study';
    this.add_case_study = true;
    this.edit_case_study = false;
    this.caseStudyForm.reset();
  }

  addCaseStudy(){
    if (this.caseStudyForm.invalid) return;
    const formData = new FormData();
    formData.append('title', this.caseStudyForm.value.title);
    formData.append('description', this.caseStudyForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.caseStudySRV.createCaseStudy(formData).subscribe(()=>{
      this.toster.success('Case study create successfull');
      this.getAllCaseStudy();
      this.caseStudyForm.reset();
    }, error=>{
      console.error('Error in case study api', error);
      this.toster.error('case study is not created');
    })
    
  }

  editCaseStudy(caseStudy_id: any){
    this.selectedCaseStudyId = caseStudy_id;
    this.edit_case_study = true;
    this.add_case_study = false;
    this.popup_header = 'Update Case Study';

    this.caseStudySRV.singleCaseStudy(this.selectedCaseStudyId).subscribe((res) => {
      this.single_CaseStudy_data = res;
      this.caseStudyForm.patchValue({
        title: this.single_CaseStudy_data.title,
        description: this.single_CaseStudy_data.description
      });
    });
  }

  udpateCaseStudy(){
    if (this.caseStudyForm.invalid) return;
    const formData = new FormData();
    formData.append('title', this.caseStudyForm.value.title);
    formData.append('description', this.caseStudyForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.caseStudySRV.updateCaseStudy(this.selectedCaseStudyId, formData).subscribe(()=>{
      this.toster.success('blog udpate successfull');
        this.caseStudyForm.reset();
        this.getAllCaseStudy();
    }, error=>{
      console.error('Error updating blog', error);
        this.toster.error('Error updating blog');
    })
  }

  deleteCaseStudy(id:number){
    let cnf = confirm('Are you sure this casestudy is deleted');

    if (cnf) {
      this.caseStudySRV.deleteCaseStudy(id).subscribe(
        () => {
          this.getAllCaseStudy();
          this.toster.success('Casestudy deleted successfully');
        },
        (error) => {
          console.error('Error deleting case study', error);
          this.toster.error('Casestudy not deleted');
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  
  
}
