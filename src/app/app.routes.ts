import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { RegisterComponent } from './auth/register/register.component';
import { roleGurdGuard } from './gurd/role-gurd.guard';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { CreateBlogComponent } from './component/create-blog/create-blog.component';
import { CreateNewsComponent } from './component/create-news/create-news.component';
import { CreateCasestudyComponent } from './component/create-casestudy/create-casestudy.component';
import { CreateServiceComponent } from './component/create-service/create-service.component';
import { CreateSliderComponent } from './component/create-slider/create-slider.component';
import { CreateProjectComponent } from './component/create-project/create-project.component';
import { ProfileComponent } from './component/profile/profile.component';
import { SettingComponent } from './component/setting/setting.component';
import { ManageUserComponent } from './component/manage-user/manage-user.component';
import { BlogComponent } from './component/blog/blog.component';
import { CaseStudyComponent } from './component/case-study/case-study.component';
import { NewsComponent } from './component/news/news.component';
import { CompanyComponent } from './component/company/company.component';
import { ProjectComponent } from './component/project/project.component';
import { BlogDetailComponent } from './component/blog-detail/blog-detail.component';

export const routes: Routes = [
   {path:'home', component: HomeComponent},
   {path:'', redirectTo:'/home', pathMatch:'full'},
   {path:'blog', component: BlogComponent},
   {path:'blogs', component: BlogDetailComponent},
   {path:'case-study', component:CaseStudyComponent},
   {path:'news', component:NewsComponent},
   {path:'company', component: CompanyComponent},
   {path:'project', component:ProjectComponent},
   {path:'create-blog', component:CreateBlogComponent},
   {path:'create-news', component:CreateNewsComponent},
   {path:'create-casestudy', component:CreateCasestudyComponent},
   {path:'create-service', component:CreateServiceComponent},
   {path:'create-slider', component:CreateSliderComponent},
   {path:'create-project', component:CreateProjectComponent},
   {path:'login', component:LoginComponent},
   {path:'dashboard', canActivate:[roleGurdGuard], component: LoginComponent},
   {path:'admin-dashboard', component: AdminDashboardComponent},
   {path:'user-dashboard', component: UserDashboardComponent},
   {path:'manage-user', component: ManageUserComponent},
   {path:'profile', component:ProfileComponent},
   {path:'setting', component:SettingComponent},
   {path:'register', component: RegisterComponent},
   {path:'**', component:NotfoundComponent},
];
