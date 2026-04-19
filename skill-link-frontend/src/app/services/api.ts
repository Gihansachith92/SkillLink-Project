import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private baseUrl = 'https://skilllink-api-gjbcgzabb5c5fnbe.eastasia-01.azurewebsites.net/api/auth';

  constructor(private http: HttpClient){}

  register(userData: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(credentials: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // 1. Save the user data to the browser
  saveUser(userData: any){
     localStorage.setItem('skilllink_user', JSON.stringify(userData));
  }

  getUser(){
    const user = localStorage.getItem('skilllink_user');
    return user ? JSON.parse(user): null;
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('skilllink_user');
  }

  logout(){
    localStorage.removeItem('skilllink_user');
  }

  // new Feed and Search method
  getFeed(currentUserId: number, skill?: string): Observable<any>{
    let url = `https://skilllink-api-gjbcgzabb5c5fnbe.eastasia-01.azurewebsites.net/api/users/feed?currentUserId=${currentUserId}`;
    if(skill) {
      url += `&skill=${skill}`;
    }
    return this.http.get(url);
  }

  updateProfile(userId: number, profileData: any): Observable<any> {
    const url = `https://skilllink-api-gjbcgzabb5c5fnbe.eastasia-01.azurewebsites.net/api/users/${userId}/profile`;
    return this.http.put(url,profileData);
  }

  // --- NEW: FETCH FULL CURRENT USER PROFILE ---
  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`https://skilllink-api-gjbcgzabb5c5fnbe.eastasia-01.azurewebsites.net/api/users/${userId}`);
  }

  // Fetches a list of all students to build the post author dictionary
  getAllUsers() {
    // Make sure this matches your actual backend URL pattern!
    return this.http.get<any[]>('https://skilllink-api-gjbcgzabb5c5fnbe.eastasia-01.azurewebsites.net/api/users/all');
  }

  // Obliterates a user account
  deleteUserAccount(userId: number) {
    return this.http.delete(`https://skilllink-api-gjbcgzabb5c5fnbe.eastasia-01.azurewebsites.net/api/users/delete/${userId}`);
  }
  
}
