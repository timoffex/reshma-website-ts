import { query, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, delay, map, Observable, tap } from 'rxjs';

import { detailDisappearAnimation, gridCardsAppearAnimation, gridFlipCardsAnimation } from './animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('homePageState', [
      transition('void => Grid', [
        query('.item-group', useAnimation(gridCardsAppearAnimation)),
      ]),
      transition('Grid => Detail', [
        query('.detail-container', style({ visibility: 'hidden' })),
        query('.item-group', useAnimation(gridFlipCardsAnimation)),
      ]),
      transition('Detail => Grid', [
        query('.item-group', style({ visibility: 'hidden' })),
        query('.detail-container', useAnimation(detailDisappearAnimation)),
        query('.item-group', [
          style({ visibility: 'visible' }),
          useAnimation(gridCardsAppearAnimation),
        ])
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) { }

  /**
   * Whether clicks on grid items should do anything.
   * 
   * This is used to prevent clicks during animations.
   */
  private canClick: boolean = true;

  /**
   * The src to use for the back-of-card image when transitioning to the detail view.
   * 
   * This runs immediately before `selectedItem$` changes so that the change is applied
   * to the DOM before the animation starts (or else it is not applied).
   */
  cardBacksideSrc$: Observable<string | undefined> | undefined;

  /** The selected item for the detail view, or undefined. */
  selectedItem$: Observable<Item | undefined> | undefined;

  /**
   * Whether the page is ready to display.
   * 
   * This is set to true after query parameters have been parsed to avoid
   * an unnecessary Grid=>Detail animation.
   */
  readonly ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    const selectedItemBase$ = this.activatedRoute.params.pipe(map((params) => itemMap.get(params['detailid'])));

    this.cardBacksideSrc$ = selectedItemBase$.pipe(map(item => item?.detailSrc));
    this.selectedItem$ = selectedItemBase$.pipe(
      // Hackaround to ensure cardBacksideSrc updates first
      delay(0),
      tap(() => this.ready$.next(true)));
  }

  gridItemAt(row: number, col: number): Item | undefined {
    return itemMap.get(gridItemNames[(row - 1) * 3 + col - 1]);
  }

  selectItemAt(row: number, col: number): void {
    if (!this.canClick) return;
    this.router.navigate(['home', gridItemNames[(row - 1) * 3 + col - 1]]);
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

interface Item {
  detailSrc: string;
  gridSrc: string;
}

const gridItemNames: string[] = [
  'frog', 'stump', 'honey',
  'honey', 'frog', 'stump',
  'stump', 'honey', 'frog',
];
const itemMap: Map<string, Item> = new Map([
  ['frog', { detailSrc: 'assets/frog.jpg', gridSrc: 'assets/frog_gallery.jpg' }],
  ['honey', { detailSrc: 'assets/honey.jpg', gridSrc: 'assets/honey_gallery.jpg' }],
  ['stump', { detailSrc: 'assets/stump.jpg', gridSrc: 'assets/stump_gallery.jpg' }],
]);