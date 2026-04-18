import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { Connection } from '../../services/connection';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  currentUser: any = null;
  pendingCount: number = 0;
  feedUsers: any[] = [];
  searchQuery: string = '';
  pendingRequests: Set<number> = new Set<number>();
  // --- New Campus Feed Variables ---
  posts: any[] = [];
  userDictionary: { [key: number]: any } = {};
  newPostContent: string = '';
  newPostGithubLink: string = '';
  showGithubInput: boolean = false;

  constructor(
    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private connectionService: Connection,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    // 1. Security Check: Kick them out if they aren't logged in
    if (!this.apiService.isLoggedIn()) {
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
        this.loadCampusFeed();
        // Fetch all users to translate author IDs into real names and pictures
        this.apiService.getAllUsers().subscribe({
          next: (users) => {
            users.forEach((u: any) => (this.userDictionary[u.id] = u));
            // Ensure the current user is also securely in the dictionary
            this.userDictionary[this.currentUser.id] = this.currentUser;
          },
        });
      },
      error: (err) => {
        console.error('Failed to load full profile', err);
        this.loadFeed();
        this.loadCampusFeed();
      },
    });

    // 2. Load the user's nametag from Local Storage
    // this.currentUser = this.apiService.getUser();

    // 3. Load the matchmaking feed
    // this.loadFeed();
  }

  loadPendingCount() {
    if (!this.currentUser) return;

    this.connectionService.getIncomingRequests(this.currentUser.id).subscribe({
      next: (requests: any[]) => {
        this.pendingCount = requests.length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load pending count', err);
      },
    });
  }

  loadFeed() {
    this.apiService.getFeed(this.currentUser.id, this.searchQuery).subscribe({
      next: (users) => {
        this.feedUsers = users;
        this.hideConnectedUsers();
        this.loadPendingCount();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load feed', err);
      },
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

  isMobileMenuOpen: boolean = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  editData = {
    bio: '',
    profileImageUrl: '',
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
  };

  newSkillOffered: string = '';
  newSkillWanted: string = '';

  openEditModal() {
    // 1. Pre-fill the form with your current data so it doesn't start blank
    this.editData.bio = this.currentUser.bio || '';
    this.editData.profileImageUrl = this.currentUser.profileImageUrl || '';

    // Use the spread operator [...] to create a safe copy of existing skills
    this.editData.skillsOffered = this.currentUser.skillsOffered
      ? [...this.currentUser.skillsOffered]
      : [];
    this.editData.skillsWanted = this.currentUser.skillsWanted
      ? [...this.currentUser.skillsWanted]
      : [];

    this.isEditModalOpen = true;
    this.cdr.detectChanges();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.cdr.detectChanges();
  }

  addSkill(type: 'offered' | 'wanted') {
    if (type == 'offered' && this.newSkillOffered.trim()) {
      this.editData.skillsOffered.push(this.newSkillOffered.trim());
      this.newSkillOffered = '';
    } else if (type == 'wanted' && this.newSkillWanted.trim()) {
      this.editData.skillsWanted.push(this.newSkillWanted.trim());
      this.newSkillWanted = '';
    }
  }

  removeSkill(type: 'offered' | 'wanted', index: number) {
    if (type == 'offered') {
      this.editData.skillsOffered.splice(index, 1);
    } else {
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
      },
    });
  }

  sendLinkRequest(receiverId: number) {
    if (!this.currentUser) {
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
        console.error('Failed to send request', error);
        this.pendingRequests.delete(receiverId);
        this.cdr.detectChanges();
        alert('Could not send request. ' + (error.error || 'Please try again.'));
      },
    });
  }

  // A helper method for the HTML to check if a button should say "Pending..."
  isPending(studentId: number): boolean {
    return this.pendingRequests.has(studentId);
  }

  hideConnectedUsers() {
    if (!this.currentUser) return;
    const myId = this.currentUser.id;

    // 1. Fetch Accepted Friends
    this.connectionService.getAcceptedConnections(myId).subscribe({
      next: (accepted) => {
        // 2. Fetch Requests I Sent (Pending)
        this.connectionService.getSentRequests(myId).subscribe({
          next: (sent) => {
            // 3. Fetch Requests Sent To Me (Pending)
            this.connectionService.getIncomingRequests(myId).subscribe({
              next: (incoming) => {
                // Use a Set to store all the IDs of people we want to hide
                const hiddenIds = new Set<number>();

                // Add accepted friends (check both sender and receiver to find THEIR id)
                accepted.forEach((conn: any) => {
                  hiddenIds.add(conn.sender.id === myId ? conn.receiver.id : conn.sender.id);
                });

                // Add people I sent requests to
                sent.forEach((conn: any) => hiddenIds.add(conn.receiver.id));

                // Add people who sent me requests
                incoming.forEach((conn: any) => hiddenIds.add(conn.sender.id));

                // FILTER THE FEED: Keep only users whose ID is NOT in the hiddenIds list
                this.feedUsers = this.feedUsers.filter((user: any) => !hiddenIds.has(user.id));

                this.cdr.detectChanges();
              },
            });
          },
        });
      },
    });
  }

  goToNetwork() {
    this.router.navigate(['/network']);
  }

  // ==========================================
  // NEW LOGIC: DIGITAL CAMPUS FEED
  // ==========================================
  loadCampusFeed() {
    this.http.get<any[]>('http://localhost:8080/api/posts/feed').subscribe({
      next: (data) => {
        this.posts = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load feed', err),
    });
  }

  toggleGithubInput() {
    this.showGithubInput = !this.showGithubInput;
  }

  publishPost() {
    if (!this.newPostContent.trim()) return;

    const postPayload = {
      authorId: this.currentUser.id,
      content: this.newPostContent,
      githubLink: this.newPostGithubLink,
    };

    this.http.post<any>('http://localhost:8080/api/posts/create', postPayload).subscribe({
      next: (savedPost) => {
        this.posts.unshift(savedPost); // Instantly add to top of feed
        this.newPostContent = '';
        this.newPostGithubLink = '';
        this.showGithubInput = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to publish post', err),
    });
  }

  // Translates an ID into a real user object
  getPostAuthor(authorId: number) {
    return this.userDictionary[authorId] || { name: 'Unknown Student', profileImageUrl: null };
  }

  // Deletes the post from the database and the screen
  deletePost(postId: number) {
    if (confirm('Warning, are you sure you wish to delete this post?')) {
      this.http.delete(`http://localhost:8080/api/posts/delete/${postId}`).subscribe({
        next: () => {
          // Remove the post from the screen instantly without refreshing
          this.posts = this.posts.filter(post => post.id !== postId);
        },
        error: (err) => console.error('Failed to delete post', err)
      });
    }
  }

  // Triggers the account deletion process
  deleteAccount() {
    const confirmDelete = confirm('DANGER, Are you absolutely sure you want to delete your account? This action cannot be undone and will erase all your posts, messages, and connections.');
    
    if (confirmDelete && this.currentUser) {
      this.apiService.deleteUserAccount(this.currentUser.id).subscribe({
        next: () => {
          alert('Account successfully deleted from the SkillLink.');
          this.closeEditModal();
          this.logout(); // Instantly log them out and route to login
        },
        error: (err) => {
          console.error('Failed to delete account', err);
          alert('Could not delete account. Please check the console for details.');
        }
      });
    }
  }


}
