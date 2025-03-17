import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { RegisterComponent } from './auth/register/register.component';
import { roleGurdGuard } from './gurd/role-gurd.guard';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';

export const routes: Routes = [
   {path:'login', component:LoginComponent},
   {
      path:'admin-dashboard', 
      component: AdminDashboardComponent, 
      canActivate:[roleGurdGuard], 
      data:{role: 1}
   },
   {
      path:'user-dashboard', 
      component: UserDashboardComponent, 
      canActivate:[roleGurdGuard], 
      data:{role: 2}
   },
   {path:'', redirectTo:'/login', pathMatch:'full'},
   {path:'register', component: RegisterComponent},
   {path:'***', component:NotfoundComponent},
];
