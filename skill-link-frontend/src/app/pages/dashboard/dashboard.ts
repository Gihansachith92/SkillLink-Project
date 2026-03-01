import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { Connection } from '../../services/connection';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit{

  currentUser: any = null;
  feedUsers: any[] = [];
  searchQuery: string = '';
  pendingRequests: Set<number> = new Set<number>();

  constructor(private apiService: Api, private router: Router, private cdr: ChangeDetectorRef, private connectionService: Connection){}

  ngOnInit() {
    // 1. Security Check: Kick them out if they aren't logged in
    if(!this.apiService.isLoggedIn()){
        this.router.navigate(['/login']);
        return;
    }

    // Grab the basic ID from local storage
    const basicUser = this.apiService.getUser();
    this.currentUser = basicUser;

    // FETCH THE FULL PROFILE FROM JAVA
    this.apiService.getUserProfile(basicUser.id).subscribe({
      next: (fullProfile) => {
        this.currentUser = fullProfile;
        this.cdr.detectChanges();

        this.loadFeed();
      },
      error: (err) => {
        console.error('Failed to load full profile', err);
        this.loadFeed();
      }
        
    });

    // 2. Load the user's nametag from Local Storage
    // this.currentUser = this.apiService.getUser();

    // 3. Load the matchmaking feed
    // this.loadFeed();

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

    // Use the spread operator [...] to create a safe copy of existing skills
    this.editData.skillsOffered = this.currentUser.skillsOffered ? [...this.currentUser.skillsOffered] : [];
    this.editData.skillsWanted = this.currentUser.skillsWanted ? [...this.currentUser.skillsWanted] : [];

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

        this.currentUser.skillsOffered = response.user.skillsOffered;
        this.currentUser.skillsWanted = response.user.skillsWanted;

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

  sendLinkRequest(receiverId: number) {

    if(!this.currentUser) {
      alert('You must be logged in to send a request!');
      return;
    }

    // 1. Immediately mark this user as 'Pending' so the button updates instantly
    this.pendingRequests.add(receiverId);
    this.cdr.detectChanges();

    this.connectionService.sendRequest(this.currentUser.id, receiverId).subscribe({
      next: (response) => {
        console.log('Request sent successfully!', response);
      },
      error: (error) => {
        console.error('Failed to send request',error);
        this.pendingRequests.delete(receiverId);
        this.cdr.detectChanges();
        alert("Could not send request. " + (error.error || "Please try again."));
      }
    });

  }

  // A helper method for the HTML to check if a button should say "Pending..."
  isPending(studentId: number): boolean {
    return this.pendingRequests.has(studentId);
  }


}
