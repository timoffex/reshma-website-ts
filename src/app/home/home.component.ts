import { animate, animateChild, group, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('homePageState', [
      transition('Grid => Detail', [
        query('@detail', style({ visibility: 'hidden' })),
        query('@grid', animateChild()),
      ]),
      transition('Detail => Grid', [
        query('@grid', style({ visibility: 'hidden' })),
        query('@detail', animateChild()),
        query('@grid', [
          style({ visibility: 'visible' }),
          animateChild(),
        ])
      ]),
    ]),
    trigger('detail', [
      transition(':leave', [
        query('img', [
          animate('500ms ease-in', style({
            transform: 'translateY(-100%)',
            opacity: 0,
          }))
        ])
      ])
    ]),
    trigger('grid', [
      transition(':enter', [
        query('.item', [
          style({ opacity: 0, transform: 'translateY(50%)' }),
          stagger(100, [
            animate('300ms')
          ]),
        ])
      ]),
      transition(':leave', [
        query('.item', [
          stagger(50,
            animate('1s ease-in', style({
              transform: 'rotateY(180deg)'
            }))
          ),
        ]),
        group([
          query('.item--front, .item--back', [
            animate('700ms ease-in', style({ borderRadius: 0 })),
          ]),
        ]),
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {
  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) { }

  items = Array.from(Array(10), (_, i) => `item_${i}`);
  selectedItem$: Observable<string> | undefined;
  canClick: boolean = true;

  ngOnInit(): void {
    this.selectedItem$ = this.activatedRoute.params.pipe(map((params) => params['detailid']));
  }

  selectItemAt(row: number, col: number): void {
    if (!this.canClick) return;
    this.router.navigate(['home', 'xyz']);
  }

  onGridAnimationStart(): void {
    this.canClick = false;
  }

  onGridAnimationEnd(): void {
    this.canClick = true;
  }

  goHome(): void {
    this.router.navigate(['home']);
  }

  homePageState(selectedItem: string): string {
    return selectedItem ? 'Detail' : 'Grid';
  }
}
