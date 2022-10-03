import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('currentUser'));
      this.currentUser = this.currentUserSubject.asObservable();
   }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  login(username, password): Observable<string> {
    // call auth api
    return this.http.post<any>('/api/auth', { username, password })
        .pipe(
          map(user => {
            // store access token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', user.access_token);
            this.currentUserSubject.next(user.access_token);
            return user.access_token;
        }));
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
