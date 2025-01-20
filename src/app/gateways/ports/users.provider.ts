import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

export abstract class UsersProvider {
  abstract getRandomUsers(): Observable<any>;
  abstract getUsers(): Observable<User[]>;
  abstract getUser(id: string): Observable<User | null>;
  abstract getUserByUsername(username: string): Observable<User | null>;
  abstract createUser(username: string): Observable<boolean>;
  abstract createUserAdmin(user: User): Observable<boolean>;
  abstract delete(id: string): Observable<boolean>;
  abstract login(user: User): void;
  abstract logout(): void;
  abstract edit(id: string, user: User): Observable<boolean>;
}
