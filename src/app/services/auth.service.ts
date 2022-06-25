import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {User} from '../fake-server/fake-backend';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user!: Observable<User | null>;
  private userSubject: BehaviorSubject<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user') as string));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value as User;
  }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/users/authenticate`, {username, password})
      .pipe(
        map(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user as User);
          return user;
        }),
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
