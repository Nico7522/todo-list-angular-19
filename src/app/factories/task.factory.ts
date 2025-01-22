import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { generateRandomDate, getAssociatedImage } from '../helpers/functions';
import { completed, titles } from '../services/data';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TaskFactory {
  getRandomTasks(): Observable<Task[]> {
    let todos: Task[] = [];
    let i = 0;
    while (i < 100) {
      let todo: Task = {
        title: titles[Math.floor(Math.random() * titles.length)],
        priority: Math.floor(Math.random() * 3),
        userId: null,
        id: i,
        completed: completed[Math.floor(Math.random() * completed.length)],
        creationDate: generateRandomDate(),
      };
      todo.imgUrl = getAssociatedImage(todo.title);
      if (todo.completed) {
        todo.closingDate = new Date();
      }
      todos.push(todo);
      i++;
    }
    return of(todos);
  }
}
