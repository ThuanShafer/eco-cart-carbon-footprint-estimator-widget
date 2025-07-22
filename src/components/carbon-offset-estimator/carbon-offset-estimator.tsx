import { Component, State, h, Element } from '@stencil/core';

// RXJS
import { Subject, Subscription } from 'rxjs';

// Services
import { OffsetAPIService } from '../../services/offset/offset.service';
import { ConfigAPIService } from '../../services/config/config.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  tag: 'carbon-offset-estimator',
  styleUrl: 'carbon-offset-estimator.css',
  shadow: true,
})
export class CarbonOffsetEstimator {
  @Element() el: HTMLElement;

  @State() config: { placement: string; verbiage: string } | null = null;
  @State() estimatedOffset: number | null = null;
  @State() isChecked: boolean = false;
  @State() isLoading: boolean = true;
  @State() error: string | null = null;

  protected _configService: ConfigAPIService;
  protected _offsetService: OffsetAPIService;

  private subscriptions: Subscription[] = [];
  private _destroyed$ = new Subject<void>();

  componentWillLoad() {
    this.isLoading = true;
    this.error = null;

    const configSub = this._configService.fetchWidgetConfig()
      .pipe(takeUntil(this._destroyed$))
      .subscribe({
        next: (configData) => {
          this.config = configData;
          console.log('Widget config fetched:', this.config);
          this.estimateOffsetOnLoad();
        },
        error: (err) => {
          console.error('Error fetching widget config:', err);
          this.error = `Failed to load widget config: ${err.message}`;
          this.isLoading = false;
        }
    });
    this.subscriptions.push(configSub);
  }

  private estimateOffsetOnLoad() {
    const sampleSubtotal = 303.40;
    const offsetSub = this._offsetService.estimateOffset(sampleSubtotal)
      .pipe(takeUntil(this._destroyed$))
      .subscribe({
        next: (offsetData) => {
          this.estimatedOffset = offsetData.estimated_offset;
          console.log('Estimated offset:', this.estimatedOffset);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error estimating offset:', err);
          this.error = `Failed to estimate offset: ${err.message}`;
          this.isLoading = false;
        }
    });
    this.subscriptions.push(offsetSub);
  }

  componentDidLoad() {
    if (this.config && this.config.placement) {
      const targetElement = document.querySelector(this.config.placement);
      if (targetElement) {
        if (!targetElement.contains(this.el)) {
          targetElement.appendChild(this.el);
          console.log(`Widget injected into: ${this.config.placement}`);
        } else {
          console.log(`Widget already present in: ${this.config.placement}`);
        }
      } else {
        this.error = `Target placement element "${this.config.placement}" not found.`;
        console.error(this.error);
      }
    }
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async handleCheckboxChange(event: Event) {
    this.isChecked = (event.target as HTMLInputElement).checked;
    if (this.isChecked && this.estimatedOffset !== null) {
      const payload = {
        customer_id: 'shopify-customer-abc',
        cart_id: 'shopify-cart-xyz',
        estimated_offset: this.estimatedOffset,
      };
      const trackSub = this._offsetService.trackOptIn(payload)
        .pipe(takeUntil(this._destroyed$))
        .subscribe({
          next: (result) => {
            console.log('Opt-in tracked successfully:', result);
          },
          error: (err) => {
            console.error('Error tracking opt-in:', err);
            this.error = `Failed to track opt-in: ${err.message}`;
            this.isChecked = false;
          }
      });
      this.subscriptions.push(trackSub);
    }
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

    return (
      <div class="carbon-offset-widget">
        <label>
          <input
            type="checkbox"
            checked={this.isChecked}
            onChange={(event) => this.handleCheckboxChange(event)}
          />
          <span class="verbiage">
            {this.config.verbiage.includes('$$')
              ? this.config.verbiage.replace('$$', `\$${this.estimatedOffset.toFixed(2)}`)
              : this.config.verbiage}
          </span>
        </label>
      </div>
    );
  }
}
