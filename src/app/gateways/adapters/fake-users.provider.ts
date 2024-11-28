import { Observable, of } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersProvider } from '../ports/users.provider';
import { users } from '../../services/data';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FakeUsersProvider extends UsersProvider {
  #currentUser = signal<User | null>(null);
  currentUser = this.#currentUser.asReadonly();

  override login(user: User): void {
    this.#currentUser.set(user);
  }
  override logout(): void {
    this.#username.set('');
    this.#currentUser.set(null);
    this.#role.set(null);
    this.#showMenu.set(false);
  }
  override createUser(username: string): void {
    let user: User = {
      id: 100,
      username: username,
    };
    users.push(user);
    this.login(user);
  }
  override getUser(id: number): Observable<User | null> {
    const user = users.find((u) => u.id === id);
    return user ? of(user) : of(null);
  }
  override getUsers(): Observable<User[]> {
    return of(users);
  }

  #role = signal<'admin' | 'user' | null>(null);
  role = this.#role.asReadonly();
  setRole(role: 'admin' | 'user' | null) {
    this.#role.set(role);
  }

  #username = signal('');
  username = this.#username.asReadonly();
  setUsername(username: string) {
    this.#username.set(username);
  }

  #showMenu = signal(false);
  showMenu = this.#showMenu.asReadonly();
  setShowMenu(canShow: boolean) {
    this.#showMenu.set(canShow);
  }
}
