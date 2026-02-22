import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class Register {

  user = {
     name: '',
     email: '',
     password: '',
     university: ''
  };

  message = '';
  isSuccess = false;

  constructor(private api: Api, private cdr: ChangeDetectorRef, private router: Router){}

  onSubmit() {

    this.message = 'Processing....';

    this.api.register(this.user).subscribe({
      next: (response) => {
         this.message = response.message;
         this.isSuccess = true;
         this.user = {name: '', email: '', password: '', university: ''};
         this.cdr.detectChanges();

         setTimeout(() => {
          this.router.navigate(['/login']);
         }, 2000);
      },
      error: (err) => {
        this.message = err.error?.error || 'Registration failed. Please try again.';
        this.isSuccess = false;
        this.cdr.detectChanges();
      }
    });

  }

}
