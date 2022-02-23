import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/** A directive that helps unwrap an expression. */
@Directive({
  selector: '[unwrap]'
})
export class UnwrapDirective<T = unknown> {
  private _context: UnwrapDirectiveContext<T> = new UnwrapDirectiveContext<T>();
  private _templateRef: TemplateRef<UnwrapDirectiveContext<T>> | null = null;
  private _viewRef: EmbeddedViewRef<UnwrapDirectiveContext<T>> | null = null;

  constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<UnwrapDirectiveContext<T>>) {
    this._templateRef = templateRef;
  }

  @Input()
  set unwrap(value: T) {
    this._context.$implicit = value;
    this._updateView();
  }

  private _updateView() {
    if (!this._viewRef) {
      this._viewContainer.clear();
      if (this._templateRef) {
        this._viewRef = this._viewContainer.createEmbeddedView(this._templateRef, this._context);
      }
    }
  }
}

export class UnwrapDirectiveContext<T> {
  public $implicit: T = null!;
}
