import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Signal } from '@angular/core';

export abstract class UsersProvider {
  abstract role: Signal<'admin' | 'user' | null>;
  abstract currentUser: Signal<User | null>;
  abstract username: Signal<string>;
  abstract setShowMenu(value: any): void;
  abstract setUsername(value: any): any;
  abstract setRole(value: any): void;
  abstract getUsers(): Observable<User[]>;
  abstract getUser(id: string): Observable<User | null>;
  abstract getUserByUsername(username: string): Observable<User | null>;
  abstract initUser(username: string): Observable<boolean>;
  abstract createUser(user: User): Observable<boolean>;
  abstract delete(id: string): Observable<boolean>;
  abstract login(user: User): void;
  abstract logout(): void;
  abstract edit(id: string, user: User): Observable<boolean>;
}
