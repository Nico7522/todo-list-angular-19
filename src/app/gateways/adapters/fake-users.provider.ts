import { BehaviorSubject, map, Observable, of, take, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersProvider } from '../ports/users.provider';
import { inject, signal } from '@angular/core';
import { CustomError } from '../../models/custom-error.model';
import { v4 as uuidv4 } from 'uuid';
import { UserFactory } from '../../factories/user.factory';

export class FakeUsersProvider extends UsersProvider {
  userFactory = inject(UserFactory);
  override createUser(user: User): Observable<boolean> {
    let currentList = this.#users$.getValue();
    let existingUser = currentList.find((u) => u.username === user.username);
    if (existingUser) {
      return throwError(() => {
        const error = new CustomError("L'utilisateur existe déjà", {
          status: 400,
        });
        return error;
      });
    }

    let newList = [...currentList, user];
    this.#users$.next(newList);
    return of(true);
  }
  #users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  users$ = this.#users$.asObservable();
  override delete(id: string): Observable<boolean> {
    return this.#users$.pipe(
      take(1),
      map((users) => {
        let user = users.find((u) => u.id === id);

        if (!user)
          throw new CustomError("L'utilisateur n'a pas été trouvé", {
            status: 404,
          });
        let newUserList = users.filter((u) => u.id !== id);
        this.#users$.next(newUserList);
        return true;
      })
    );
  }

  override edit(id: string, user: User): Observable<boolean> {
    return this.#users$.pipe(
      take(1),
      map((users) => {
        let index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
          users[index] = { ...users[index], ...user };
          this.#users$.next(users);
          return true;
        }
        throw new CustomError("L'utilisateur n'a pas été trouvé", {
          status: 404,
        });
      })
    );
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
  override initUser(username: string): Observable<boolean> {
    let user: User = {
      id: uuidv4(),
      username: username,
      email: 'johndoe@pmail.com',
      name: 'John',
      surname: 'Doe',
      country: 'Belgium',
      gender: 'male',
    };

    let currentList = this.#users$.getValue();
    let newList = [...currentList, user];

    if (currentList.length < newList.length) {
      this.#users$.next(newList);
      this.login(user);
      return of(true);
    }

    return throwError(() => {
      const error = new CustomError("L'utilisateur n'a pas pu être créé", {
        status: 400,
      });
      return error;
    });
  }
  override getUserByUsername(username: string): Observable<User | null> {
    return this.users$.pipe(
      map((users) => users.find((u) => u.username === username) || null)
    );
  }

  override getUser(id: string): Observable<User | null> {
    return this.#users$.pipe(
      take(1),
      map((users) => {
        let user = users.find((u) => u.id === id);

        if (user) return user;
        return null;
      })
    );
  }

  #isUserFetched = signal(false);
  override getUsers(): Observable<User[]> {
    if (!this.#isUserFetched()) {
      return this.userFactory.getRandomUsers().pipe(
        map((user) => {
          this.#users$.next(user);
          this.#isUserFetched.set(true);
          return user;
        })
      );
    }
    return this.#users$;
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
