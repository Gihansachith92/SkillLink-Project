import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ConnectionModel{
  id: number;
  sender: any;
  receiver: any;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class Connection {

  private apiUrl = 'http://localhost:8080/api/connections';

  constructor(private http: HttpClient) {}

  // 1. Send a new connection request
  sendRequest(senderId: number, receiverId: number): Observable<ConnectionModel> {
    const params = new HttpParams()
      .set('senderId', senderId.toString())
      .set('receiverId', receiverId.toString());
      
    return this.http.post<ConnectionModel>(`${this.apiUrl}/request`, null, {params});  
  }

  // 2. Accept or Decline a request
  updateStatus(connectionId: number, status: string): Observable<ConnectionModel> {
    const params = new HttpParams().set('status', status);
    return this.http.put<ConnectionModel>(`${this.apiUrl}/${connectionId}/status`, null, {params});
  }

  // 3. Withdraw/Cancel a sent request
  withdrawRequest(connectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${connectionId}`);
  }

  // 4. Get all incoming requests
  getIncomingRequests(userId: number): Observable<ConnectionModel[]> {
    return this.http.get<ConnectionModel[]>(`${this.apiUrl}/incoming/${userId}`);
  }

  // 5. Get all sent requests
  getSentRequests(userId: number): Observable<ConnectionModel[]> {
    return this.http.get<ConnectionModel[]>(`${this.apiUrl}/sent/${userId}`);
  }

  // 6. Get all accepted connections (Friends list)
  getAcceptedConnections(userId: number): Observable<ConnectionModel[]> {
    return this.http.get<ConnectionModel[]>(`${this.apiUrl}/accepted/${userId}`);
  }

  // 7. Get the exact number of incoming requests (For the Red Dot!)
  getPendingCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pending-count/${userId}`);
  }
     
  
}
