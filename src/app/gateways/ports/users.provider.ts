import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

export abstract class UsersProvider {
  abstract getUsers(): Observable<User[]>;
  abstract getUser(id: number): Observable<User | null>;
  abstract createUser(username: string): void;
  abstract logout(): void;
}
