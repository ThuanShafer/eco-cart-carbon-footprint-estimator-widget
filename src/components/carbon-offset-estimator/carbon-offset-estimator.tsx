import { Component, State, h, Element, Prop, Watch } from '@stencil/core';

// RXJS
import { of, Subject, Subscription } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

// Services
import { OffsetAPIService } from '../../services/offset/offset.service';
import { ConfigAPIService } from '../../services/config/config.service';

@Component({
  tag: 'carbon-offset-estimator',
  styleUrl: 'carbon-offset-estimator.scss',
  shadow: true,
})
export class CarbonOffsetEstimator {

  private _configService: ConfigAPIService;
  private _offsetService: OffsetAPIService;

  constructor() {
    this._configService = new ConfigAPIService();
    this._offsetService = new OffsetAPIService();
  }

  @Element() el: HTMLElement;

  @Prop() subTotal : number = 303.40;

  @State() config: { placement: string; verbiage: string; colors?: Object } | null = null;
  @State() estimatedOffset: number | null = null;
  @State() isChecked: boolean = false;
  @State() isLoading: boolean = true;
  @State() error: string | null = null;

  @State() showContextMenu: boolean = false;
  @State() contextMenuX: number = 0;
  @State() contextMenuY: number = 0;

  private subscriptions: Subscription[] = [];
  private _destroyed$ = new Subject<void>();

  @Watch('subTotal')
  onSubTotalChange(newValue: number, oldValue: number) {
    if (newValue !== oldValue) {
      this.recalculateOffset(newValue);
    }
  }

  private recalculateOffset(newSubTotal: number) {
    this.isLoading = true;
    this.error = null;

    const recalculateSub = this._offsetService.estimateOffset(newSubTotal).pipe(
      tap(offsetData => {
        this.estimatedOffset = offsetData.estimated_offset;
      }),
      catchError((err) => {
        console.error('Error during offset recalculation:', err);
        this.error = `Failed to recalculate offset: ${err.message}`;
        this.estimatedOffset = null;
        return of(null);
      }),
      takeUntil(this._destroyed$)
    ).subscribe({
      next: (data) => {
        if (data !== null) {
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Unhandled error in recalculateOffset subscription:', err);
        this.error = `An unhandled error occurred during recalculation: ${err.message}`;
        this.isLoading = false;
      },
      complete: () => {}
    });

    this.subscriptions.push(recalculateSub);
  }

  componentWillLoad() {
    this.isLoading = true;
    this.error = null;

    const configSub = this._configService.fetchWidgetConfig()
      .pipe(
        tap(configData => {
          this.config = configData;
        }),
        filter(() => typeof this.subTotal === 'number' && !isNaN(this.subTotal)),
        switchMap(() => this._offsetService.estimateOffset(this.subTotal)),
        tap(offsetData => {
          this.estimatedOffset = offsetData.estimated_offset;
        }),
        catchError((err) => {
          console.error('Error loading widget data in reactive chain:', err);
          this.error = `Failed to load widget: ${err.message}`;
          return of(null);
        }),
        takeUntil(this._destroyed$))
      .subscribe({
        next: (data) => {
        if (data !== null) {
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Unhandled error in data load subscription:', err);
        this.error = `An unhandled error occurred: ${err.message}`;
        this.isLoading = false;
      },
      complete: () => {}
    });
    this.subscriptions.push(configSub);
  }

  componentDidLoad() {
    if (this.config && this.config.placement) {
      const targetElement = document.querySelector(this.config.placement);
      if (targetElement) {
        if (!targetElement.contains(this.el)) {
          targetElement.appendChild(this.el);
        }
      } else {
        this.error = `Target placement element "${this.config.placement}" not found.`;
        console.error(this.error);
      }
    }

    // Temporary implementation to view report
    this.el.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this._destroyed$.next();
    this._destroyed$.complete();

    // Temporary implementation to view report
    this.el.removeEventListener('contextmenu', this.handleContextMenu.bind(this));
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  handleCheckboxChange(event: Event) {
    this.isChecked = (event.target as HTMLInputElement).checked;

    if (this.isChecked && this.estimatedOffset !== null) {
      const payload = {
        customer_id: 'shopify-customer-abc',
        cart_id: 'shopify-cart-xyz',
        estimated_offset: this.estimatedOffset,
      };

      const trackSub = this._offsetService.trackOptIn(payload).pipe(
        tap(() => {
          this.error = null;
        }),
        catchError((err) => {
          console.error('Error tracking opt-in:', err);
          this.error = `Failed to track opt-in: ${err.message}`;
          this.isChecked = false;
          return of(null);
        }),
        takeUntil(this._destroyed$)
      ).subscribe({
        next: (data) => {
          if (data !== null) {
          }
        },
        error: (err) => {
          console.error('Unhandled error in opt-in tracking subscription:', err);
          this.error = `An unhandled error occurred during opt-in: ${err.message}`;
        },
        complete: () => {}
      });

      this.subscriptions.push(trackSub);
    }
  }

  handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    console.log('Estimator: Context menu opened.');
    this.showContextMenu = true;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
  }

  handleDocumentClick() {
    if (this.showContextMenu) {
      console.log('Estimator: Document click, closing context menu.');
      this.showContextMenu = false;
    }
  }

  handleMenuItemClick(event: MouseEvent) {
    event.stopPropagation();
    console.log('Estimator: Menu item clicked.');
    this.showContextMenu = false;
    window.open('http://127.0.0.1:5000/api/opt-ins-report', '_blank');
  }

  render() {
    if (this.isLoading) {
      return (
        <div class="carbon-offset-widget loading">
          <p>Loading carbon offset widget...</p>
        </div>
      );
    }

    if (this.error) {
      return (
        <div class="carbon-offset-widget error">
          <p>Error: {this.error}</p>
        </div>
      );
    }

    if (!this.config || this.estimatedOffset === null) {
      return (
        <div class="carbon-offset-widget">
          <p>Widget data not available.</p>
        </div>
      );
    }

    const displayVerbiage = this.config
      ? (this.config.verbiage.includes('$$')
          ? this.config.verbiage.replace('$$', `\$${this.estimatedOffset.toFixed(2)}`)
          : this.config.verbiage)
      : `\$${this.estimatedOffset.toFixed(2)} to offset my carbon footprint`;

    return (
      <div class="carbon-offset-widget">
        <label>
          <input
            type="checkbox"
            checked={this.isChecked}
            onChange={(event) => this.handleCheckboxChange(event)}
          />
          <span class="verbiage">
            {displayVerbiage}
          </span>
        </label>

        {/* --- Temporary Implementation to view offset reporting --- */}
        {this.showContextMenu && (
          <div
            class="context-menu"
            style={{ top: `${this.contextMenuY}px`, left: `${this.contextMenuX}px` }}
            onClick={this.handleMenuItemClick.bind(this)}
          >
            <ul>
              <li>View Offset Invoice</li>
            </ul>
          </div>
        )}
        {/* --- End New Context Menu Rendering --- */}
      </div>
    );
  }
}
