import { BehaviorSubject, Observable, of, shareReplay, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersProvider } from '../ports/users.provider';
import { users } from '../../services/data';
import { inject, Injectable, signal } from '@angular/core';
import { CustomError } from '../../models/custom-error.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FakeUsersProvider extends UsersProvider {
  override createUserAdmin(username: string): Observable<boolean> {
    let existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return throwError(() => {
        const error = new CustomError("Le nom d'utilisateur existe déjà", {
          status: 400,
        });
        return error;
      });
    }

    let user: User = {
      id: users.length + 1,
      username: username,
    };
    users.push(user);
    this.users$.next(users);

    return of(true);
  }
  readonly #httpClient = inject(HttpClient);
  users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  override delete(id: number): Observable<boolean> {
    let user = users.find((u) => u.id === id);
    if (!user)
      return throwError(() => {
        const error = new CustomError('Utilisateur non trouvé', {
          status: 404,
        });
        return error;
      });
    let newUserList = users.filter((u) => u.id !== id);
    this.users$.next(newUserList);
    return of(true);
  }
  override edit(id: number, user: User): Observable<boolean> {
    let index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...user };
      return of(true);
    }
    return throwError(() => {
      const error = new CustomError(
        "Le nom d'utilisateur n'a pas pu être modifié",
        { status: 400 }
      );
      return error;
    });
  }

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
      id: users.length + 1,
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
    this.users$.next(users);
    return this.users$;
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
