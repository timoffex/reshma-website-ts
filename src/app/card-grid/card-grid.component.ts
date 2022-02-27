import { query, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, tap } from 'rxjs';

import { gridCardsAppearAnimation, gridFlipCardsAnimation } from './animations';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
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
        query('.item-group', [
          style({ visibility: 'visible' }),
          useAnimation(gridCardsAppearAnimation),
        ])
      ]),
    ]),
  ]
})
export class CardGridComponent implements OnInit {
  /**
   * Whether clicks on grid items should do anything.
   * 
   * This is used to prevent clicks during animations.
   */
  private canClick: boolean = true;

  private _selectedItem$: BehaviorSubject<Item | undefined> =
      new BehaviorSubject<Item | undefined>(undefined);

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

  readonly gridItems: GridItem[] = gridItemNames.map((name, index) => {
    const row = 1 + Math.floor(index / 2);
    const col = 1 + index % 2;

    return {
      class: `grid-cell-${row}-${col}`,
      imageSrc: itemMap.get(name)!.gridSrc,
      select: () => {
        if (!this.canClick) return;
        this._selectedItem$.next(itemMap.get(name)!);
      },
    };
  });

  ngOnInit(): void {
    this.cardBacksideSrc$ = this._selectedItem$.pipe(map(item => item?.detailSrc));
    this.selectedItem$ = this._selectedItem$.pipe(
      // Hackaround to ensure cardBacksideSrc updates first
      delay(0),
      tap(() => { if (!this.ready$.value) this.ready$.next(true); }));
  }

  onGridAnimationStart(): void {
    this.canClick = false;
  }

  onGridAnimationEnd(): void {
    this.canClick = true;
  }

  goHome(): void {
    this._selectedItem$.next(undefined);
  }

  homePageState(selectedItem: Item | null | undefined): string {
    return selectedItem ? 'Detail' : 'Grid';
  }
}

interface Item {
  detailSrc: string;
  gridSrc: string;
}

interface GridItem {
  class: string;
  imageSrc: string;
  select: () => void;
}

const gridItemNames: string[] = [
  'frog', 'stump',
  'honey', 'mushroom',
];

const itemMap: Map<string, Item> = new Map([
  ['frog', { detailSrc: 'assets/frog.jpg', gridSrc: 'assets/frog_gallery.jpg' }],
  ['honey', { detailSrc: 'assets/honey.jpg', gridSrc: 'assets/honey_gallery.jpg' }],
  ['stump', { detailSrc: 'assets/stump.jpg', gridSrc: 'assets/stump_gallery.jpg' }],
  ['mushroom', { detailSrc: 'assets/mushroom.jpg', gridSrc: 'assets/mushroom_gallery.jpg' }],
]);