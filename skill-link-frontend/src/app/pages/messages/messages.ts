import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '@stomp/stompjs';
import { Api } from '../../services/api';
import { HttpClient } from '@angular/common/http';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy{

  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  currentUser: any = null;
  chatPartnerId: number | null = null;
  chatPartner: any = null;

  // chat variables
  stompClient!: Client;
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: Api,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.apiService.getUser();
    if(!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam){
        this.chatPartnerId = +idParam;
        this.loadChatPartnerProfile();
        this.loadChatHistory();
        this.connectWebSocket();
      }
    });
  }

  ngOnDestroy() {
    if(this.stompClient){
      this.stompClient.deactivate();
    }
  }

  // --- 1. REST API: Fetch History & Profile ---

  loadChatPartnerProfile() {
    if(!this.chatPartnerId) return;
    this.apiService.getUserProfile(this.chatPartnerId).subscribe({
      next: (profile) => {
        this.chatPartner = profile;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load chat partner', err)
    });
  }

  loadChatHistory() {
    if(!this.chatPartnerId) return;
    this.http.get<any[]>(`http://localhost:8080/api/messages/${this.currentUser.id}/${this.chatPartnerId}`)
    .subscribe({
      next: (history) => {
        this.messages = history;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err) => console.error('Failed to load history', err)
    });
  }

  // --- 2. WEBSOCKET: Real-Time Connection ---

  connectWebSocket() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str)
    });

    this.stompClient
  }

}
