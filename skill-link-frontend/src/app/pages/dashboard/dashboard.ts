import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit{

  currentUser: any = null;
  feedUsers: any[] = [];
  searchQuery: string = '';

  constructor(private apiService: Api, private router: Router){}

  ngOnInit() {
    // 1. Security Check: Kick them out if they aren't logged in
    if(!this.apiService.isLoggedIn()){
        this.router.navigate(['/login']);
        return;
    }

    // 2. Load the user's nametag from Local Storage
    this.currentUser = this.apiService.getUser();

    // 3. Load the matchmaking feed
    this.loadFeed();

  }

  loadFeed() {
    this.apiService.getFeed(this.currentUser.id, this.searchQuery).subscribe({
      next: (users) => {
        this.feedUsers = users;
      },
      error: (err) => {
        console.error('Failed to load feed', err);
      }
    });
  }

  onSearch() {
    // Triggers when the user presses Enter in the search bar
    this.loadFeed();
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

}
