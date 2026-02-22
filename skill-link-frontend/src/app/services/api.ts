import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private baseUrl = 'http://localhost:8080/api/auth';

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
  
}
