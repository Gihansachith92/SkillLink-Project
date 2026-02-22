import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';

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

  constructor(private apiService: Api, private cdr: ChangeDetectorRef){}

  onSubmit(){

    this.message = 'Authenticating....';

    this.apiService.login(this.credentials).subscribe({

      next: (response: any) => {
        this.message = response.message;
        this.isSuccess = true;
        this.credentials = {email: '', password: ''};

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = err.error?.error || 'Login failed. Please try again.';
        this.isSuccess = false;

        this.cdr.detectChanges();
      }

    });

  }

}
