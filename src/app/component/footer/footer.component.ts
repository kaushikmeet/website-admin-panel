import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  email = 'support@example.com';
  
  getMaskedEmail(): string {
    const [name, domain] = this.email.split('@');
    const maskedName = name.length > 8 ? name[0] + name.slice(-8) : name;
    return `${maskedName}@${domain}`;
  }
}
