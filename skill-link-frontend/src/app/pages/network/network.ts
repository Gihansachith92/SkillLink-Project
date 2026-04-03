import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Connection } from '../../services/connection';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-network',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network.html',
  styleUrl: './network.css',
})
export class Network implements OnInit{

  currentUser: any = null;
  activeTab: 'incoming' | 'sent' | 'accepted' = 'incoming';

  incomingRequests: any[] = [];
  sentRequests: any[] = [];
  acceptedConnections: any[] = [];

  constructor(
    private connectionService: Connection,
    private apiService: Api,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.apiService.getUser();
    if(this.currentUser) {
      this.loadAllNetworkData();
    }
  }

  // Switches between the 3 tabs
  setTab(tab: 'incoming' | 'sent' | 'accepted') {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  // Fetches all 3 lists from your Spring Boot backend
  loadAllNetworkData() {
    const myId = this.currentUser.id;

    this.connectionService.getIncomingRequests(myId).subscribe(data => {
      this.incomingRequests = data;
      this.cdr.detectChanges();
    });

    this.connectionService.getSentRequests(myId).subscribe(data => {
      this.sentRequests = data;
      this.cdr.detectChanges();
    });

    this.connectionService.getAcceptedConnections(myId).subscribe(data => {
      this.acceptedConnections = data;
      this.cdr.detectChanges();
    });


  }

  // A helper method so the HTML always knows who the "other" person is, 
  // regardless of who sent or received the request.
  getOtherUser(request: any): any {
    return request.sender.id === this.currentUser.id ? request.receiver : request.sender;
  }

  // --- ACTION BUTTONS ---
  acceptRequest(request: any) {
    this.connectionService.updateStatus(request.id, 'ACCEPTED').subscribe(() => {
      // Remove from incoming, add to accepted
      this.incomingRequests = this.incomingRequests.filter(req => req.id !== request.id);
      this.acceptedConnections.push(request);
      this.cdr.detectChanges();
    });
  }

  declineRequest(requestId: number) {
    this.connectionService.updateStatus(requestId, 'DECLINED').subscribe(() => {
      this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId);
      this.cdr.detectChanges();
    });
  }

  withdrawRequest(requestId: number) {
    this.connectionService.withdrawRequest(requestId).subscribe(() => {
      this.sentRequests = this.sentRequests.filter(req => req.id !== requestId);
      this.cdr.detectChanges();
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  disconnectUser(connectionId: number) {
    if(confirm("Are you sure you want to remove this connection?")) {
      this.connectionService.withdrawRequest(connectionId).subscribe({
        next: () => {
          this.acceptedConnections =  this.acceptedConnections.filter(conn => conn.id !== connectionId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to disconnect', err)
      });
    }
  }

  goToMessages(userId: number) {
    this.router.navigate(['/messages', userId]);
  }


}
