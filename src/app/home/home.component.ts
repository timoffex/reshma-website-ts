import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('flipToDetail', [
    ])
  ]
})
export class HomeComponent implements OnInit {
  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) { }

  items = Array.from(Array(10), (_, i) => `item_${i}`);

  selectedItem$: Observable<string> | undefined;

  ngOnInit(): void {
    this.selectedItem$ = this.activatedRoute.params.pipe(map((params) => params['detailid']));
  }

  selectItemAt(row: number, col: number): void {
    // this.router.navigate(['detail', item], {
    //   state: { 'image_bounds': 'xyz' }
    // });
  }

  flipData(row: number, col: number): void {

  }
}
