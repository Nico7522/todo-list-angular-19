import { catchError, EMPTY, map, Observable } from 'rxjs';
import { FakeTasksProvider } from '../gateways/adapters/fake-tasks.provider';
import { Task } from '../models/task.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from '../services/message.service';

export function getAssociatedImage(title: string) {
  let imgUrl = '';
  switch (title) {
    case 'Faire le ménage':
      imgUrl = 'cleaning.jpg';
      break;
    case 'Faire les courses':
      imgUrl = 'food-shop.webp';
      break;
    case 'Tondre la pelouse':
      imgUrl = 'tondeuse.jpg';
      break;
    case 'Ranger la chambre':
      imgUrl = 'rangement.jpg';
      break;
    case 'Faire ses devoirs':
      imgUrl = 'study.jpeg';
      break;
    default:
      break;
  }

  return imgUrl;
}

export function generateRandomDate(): Date {
  let month = Math.floor(Math.random() * 13);
  let day = Math.floor(Math.random() * 31);
  let year = Math.floor(Math.random() * (2024 - 2000)) + 2000;
  let date = new Date(year, month, day);

  return date;
}

export function returnDateToString(date: string | Date): string {
  return typeof date === 'string' ? date : date.toLocaleDateString();
}

export function formateDate(date: string): Date {
  let splitdDate = date.split('/');
  let stringDate = `${splitdDate[1]}/${splitdDate[0]}/${splitdDate[2]}`;
  return new Date(stringDate);
}

export function createTask(
  tasksProvider: FakeTasksProvider,
  hasImage: boolean,
  task: Task,
  formData: FormData,
  messageService: MessageService
): Observable<number> {
  if (hasImage) {
    return tasksProvider.create(task, formData).pipe(
      map((taskId) => taskId),
      catchError((e) => {
        messageService.showMessage('Une erreur est survenue.', 'error');
        messageService.hideLoader();
        return EMPTY;
      })
    );
    // .subscribe({
    //   next: (taskId) => {
    //     this.isFormUntouched.set(true);
    //     messageService.showMessage(
    //       'La tâche a été crée.',
    //       'success'
    //     );
    //     messageService.hideLoader();
    //     this.#router.navigate(['/task', taskId]);
    //   },
    // });
  } else {
    return tasksProvider.createWithoutPicture(task).pipe(
      map((taskId) => taskId),
      catchError((e) => {
        messageService.showMessage('Une erreur est survenue.', 'error');
        messageService.hideLoader();
        return EMPTY;
      })
    );
    // .subscribe({
    //   next: (taskId) => {
    //     this.isFormUntouched.set(true);
    //     messageService.showMessage(
    //       'La tâche a été crée.',
    //       'success'
    //     );
    //     messageService.hideLoader();
    //     this.#router.navigate(['/task', taskId]);
    //   },
    // });
  }
}
