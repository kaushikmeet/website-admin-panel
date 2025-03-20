import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn:'root'
})

export class roleGurdGuard implements CanActivate{
  constructor(private roleSRV: UserService, private router: Router){}
  canActivate(): boolean {
    const userRole = parseInt(this.roleSRV.getRole(), 10);

    if (userRole === 1) {
      this.router.navigate(['/admin-dashboard']); 
      return false;
    } else if (userRole === 2) {
      this.router.navigate(['/user-dashboard']); 
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   const expectedRole = parseInt(route.data['role'], 10);
  //   const userRole = parseInt(this.roleSRV.getRole(), 10); 

  //   if (!this.roleSRV.isAuthenticated() || userRole !== expectedRole) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }

  //   return true;
  // }
  }
}
