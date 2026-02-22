import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {

  credentials = {
    email: '',
    password: ''
  };

  message = '';
  isSuccess = false;

  constructor(private apiService: Api, private cdr: ChangeDetectorRef, private router: Router){}

  onSubmit(){

    this.message = 'Authenticating....';

    this.apiService.login(this.credentials).subscribe({

      next: (response: any) => {
        this.message = response.message;
        this.isSuccess = true;

        // SAVE TO LOCAL STORAGE: We grab the name and email Java just sent
        this.apiService.saveUser({
          name: response.name,
          email: response.email
        });

        this.credentials = {email: '', password: ''};

        this.cdr.detectChanges();

        // Redirect to a dashboard after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        },1500);
      },
      error: (err) => {
        this.message = err.error?.error || 'Login failed. Please try again.';
        this.isSuccess = false;

        this.cdr.detectChanges();
      }

    });

  }

}
