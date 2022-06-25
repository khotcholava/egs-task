import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {delay, dematerialize, materialize, Observable, of, throwError} from 'rxjs';

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'Admin',
    role: 'Admin',
    permissions: ['View, Edit, Delete']
  },
  {
    id: 2,
    username: 'editor',
    password: 'editor',
    firstName: 'Editor',
    lastName: 'Editor',
    role: 'Editor',
    permissions: ['View', 'Edit']
  },
  {
    id: 3,
    username: 'subscriber',
    password: 'subscriber',
    firstName: 'Subscriber',
    lastName: 'Subscriber',
    role: 'Subscriber',
    permissions: ['View']
  },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = req;

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        default:
          // pass through any requests not handled above
          return next.handle(req);
      }
    }

    function authenticate() {
      const {username, password} = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: `fake-jwt-token.${user.id}`,
      });
    }


    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      // only admins can access other user records
      if (!isAdmin() && currentUser()?.id !== idFromUrl()) return unauthorized();

      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }

    function ok(body: any) {
      return of(new HttpResponse({status: 200, body}))
        .pipe(delay(500)); // delay observable to simulate server api call
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'unauthorized'}})
        .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function error(message: string) {
      return throwError({status: 400, error: {message}})
        .pipe(materialize(), delay(500), dematerialize());
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
      return isLoggedIn() && currentUser()?.role === Role.Admin;
    }

    function currentUser(): User | undefined {
      if (!isLoggedIn()) return undefined;
      const id = parseInt(headers?.get('Authorization').split('.')[1]);
      return users.find(x => x.id === id);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }


    return handleRoute();

  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserType;
  permissions: Array<string>;
}

export type UserType = 'Admin' | 'Editor' | 'Subscriber';

export enum Role {
  Admin = 'Admin',
  Editor = 'Editor',
  Subscriber = 'Subscriber'
}
