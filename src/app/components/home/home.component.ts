import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { UsersProvider } from '../../gateways/ports/users.provider';
import { TasksProvider } from '../../gateways/ports/tasks.provider';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly #usersProvider = inject(UsersProvider);
  readonly #tasksProvider = inject(TasksProvider);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  users = this.#usersProvider.getUsers();
  role = this.#usersProvider.role;
  username = this.#usersProvider.username;

  onRoleChange(value: 'admin' | 'user') {
    this.#usersProvider.setRole(value);
  }

  onUsernameChange(username: string) {
    this.#usersProvider.setUsername(username.toLowerCase());
  }

  ngOnInit() {
    this.#usersProvider.logout();
  }
  onStart() {
    this.#messageService.showLoader();
    this.#usersProvider
      .getUsers()
      .pipe(
        switchMap((users) => {
          return this.#tasksProvider.getTasks().pipe(
            switchMap(() => {
              return this.#usersProvider.initUser(this.username()).pipe(
                tap((_) => {
                  this.#usersProvider.setShowMenu(true);
                  this.#router.navigate(['/task/list']);
                  this.#messageService.hideLoader();
                })
              );
            })
          );
        }),
        catchError((err) => {
          this.#messageService.showMessage(err.message, 'error');
          this.#messageService.hideLoader();
          return EMPTY;
        })
      )
      .subscribe();
  }

  showMessage = signal(false);
  show() {
    this.showMessage.set(!this.showMessage());
  }
}
