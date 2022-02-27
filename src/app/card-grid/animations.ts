import { animate, animation, query, stagger, style } from "@angular/animations";


/** Flips over all the cards in the grid in a staggered way. */
export const gridFlipCardsAnimation = animation([
    query('.item', [
        stagger(50, animate('1s ease-in', style({
            transform: 'rotateY(180deg)'
        }))),
    ]),
    query('.item--front, .item--back', [
        animate('700ms ease-in', style({ borderRadius: 0 })),
    ]),
]);

/** Makes the cards in the grid slide up and fade in, in a staggered way. */
export const gridCardsAppearAnimation = animation([
    query('.item', [
        style({ opacity: 0, transform: 'translateY(50%)' }),
        stagger(100, [
            animate('300ms')
        ]),
    ])
]);
