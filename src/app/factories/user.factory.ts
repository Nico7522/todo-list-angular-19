import {
  catchError,
  map,
  Observable,
  shareReplay,
  take,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomError } from '../models/custom-error.model';
@Injectable({
  providedIn: 'root',
})
export class UserFactory {
  readonly #httpClient = inject(HttpClient);
  getRandomUsers(): Observable<User[]> {
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
}
