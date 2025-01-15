import { AsyncPipe } from '@angular/common';
import { Component, linkedSignal, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { combineLatest, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-panel',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {}
