import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { User } from '../../models/user.model';
import { UsersProvider } from '../ports/users.provider';
import { inject, Injectable, signal } from '@angular/core';
import { CustomError } from '../../models/custom-error.model';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FakeUsersProvider extends UsersProvider {
  override createUserAdmin(username: string): Observable<boolean> {
    let currentList = this.users$.getValue();
    let existingUser = currentList.find((u) => u.username === username);
    if (existingUser) {
      return throwError(() => {
        const error = new CustomError("L'utilisateur existe déjà", {
          status: 400,
        });
        return error;
      });
    }
    let user: User = {
      id: uuidv4(),
      username: username,
    };
    let newList = [...currentList, user];
    this.users$.next(newList);
    return of(true);
  }
  readonly #httpClient = inject(HttpClient);
  users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  override delete(id: string): Observable<boolean> {
    return this.users$.pipe(
      map((users) => {
        let user = users.find((u) => u.id === id);
        if (!user)
          throw new CustomError("L'utilisateur n'a pas été trouvé", {
            status: 404,
          });
        let newUserList = users.filter((u) => u.id !== id);
        this.users$.next(newUserList);
        return true;
      })
    );
  }

  override edit(id: string, user: User): Observable<boolean> {
    return this.users$.pipe(
      take(1),
      map((users) => {
        let index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
          users[index] = { ...users[index], ...user };
          this.users$.next(users);
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
  override createUser(username: string): Observable<boolean> {
    let user: User = {
      id: uuidv4(),
      username: username,
      email: 'johndoe@pmail.com',
      name: 'John',
      surname: 'Doe',
      country: 'Belgium',
      gender: 'male',
    };

    let currentList = this.users$.getValue();
    let newList = [...currentList, user];

    if (currentList.length < newList.length) {
      this.users$.next(newList);
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
      map((users) => {
        let user = users.find((u) => u.username === username);
        return user ? user : null;
      })
    );
  }

  override getUser(id: string): Observable<User | null> {
    return this.users$.pipe(
      take(1),
      map((users) => {
        let user = users.find((u) => u.id === id);
        if (user) return user;
        return null;
      })
    );
  }

  override getRandomUsers(): Observable<User[]> {
    let userList: User[] = [];

    return this.#httpClient
      .get<{ results: any[] }>(`https://randomuser.me/api/?results=100`)
      .pipe(
        take(1),
        map((data) => {
          data.results.map(
            (u: {
              login: { uuid: string; username: string };
              email: string;
              name: { first: string; last: string };
              location: { country: string };
              gender: 'female' | 'male';
              picture: { medium: string };
            }) => {
              let user: User = {
                id: u.login.uuid,
                username: u.login.username,
                email: u.email,
                name: u.name.first,
                surname: u.name.last,
                country: u.location.country,
                gender: u.gender,
                picture: u.picture.medium,
              };
              userList.push(user);
            }
          );
          this.users$.next(userList);
          return userList;
        }),
        catchError(() => {
          return throwError(() => {
            const error = new CustomError(
              "Les utilisateurs n'ont pas pu être généré",
              {
                status: 400,
              }
            );
            return error;
          });
        })
      );
  }

  override getUsers(): Observable<User[]> {
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
