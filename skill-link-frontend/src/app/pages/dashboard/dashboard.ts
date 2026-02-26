import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private apiService: Api, private router: Router, private cdr: ChangeDetectorRef){}

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
        this.cdr.detectChanges();
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


  isEditModalOpen: boolean = false;

  editData = {
    bio: '',
    profileImageUrl: '',
    skillsOffered: [] as string[],
    skillsWanted: [] as string[]
  };

  newSkillOffered: string = '';
  newSkillWanted: string = '';

  openEditModal() {
    // 1. Pre-fill the form with your current data so it doesn't start blank
    this.editData.bio = this.currentUser.bio || '';
    this.editData.profileImageUrl = this.currentUser.profileImageUrl || '';

    this.isEditModalOpen = true;
    this.cdr.detectChanges();
  }

  closeEditModal(){
    this.isEditModalOpen = false;
    this.cdr.detectChanges();
  }

  addSkill(type: 'offered' | 'wanted') {
    if(type == 'offered' && this.newSkillOffered.trim()){
      this.editData.skillsOffered.push(this.newSkillOffered.trim());
      this.newSkillOffered = '';
    }else if(type ==  'wanted' && this.newSkillWanted.trim()){
      this.editData.skillsWanted.push(this.newSkillWanted.trim());
      this.newSkillWanted = '';
    }
  }

  removeSkill(type: 'offered' | 'wanted', index: number) {
    if(type == 'offered') {
      this.editData.skillsOffered.splice(index,1);
    }else {
      this.editData.skillsWanted.splice(index, 1);
    }
  }


  saveProfile() {
    this.apiService.updateProfile(this.currentUser.id, this.editData).subscribe({
      next: (response) => {
        this.currentUser.bio = response.user.bio;
        this.currentUser.profileImageUrl = response.user.profileImageUrl;

        alert('Profile updated successfully!');
        this.closeEditModal();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        alert('Error saving profile.');
      }
    });
  }


}
