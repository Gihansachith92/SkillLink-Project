import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '@stomp/stompjs';
import { Api } from '../../services/api';
import { HttpClient } from '@angular/common/http';

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
      if(idParam)
    });
  }

}
