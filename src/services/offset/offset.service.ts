import { Observable } from 'rxjs';
import { HTTP } from '../http/httpService';

const BACKEND_URL = 'http://127.0.0.1:5000';

interface EstimateOffsetResponse {
  estimated_offset: number;
}

interface TrackOptInPayload {
  customer_id: string;
  cart_id: string;
  estimated_offset: number;
}

interface TrackOptInResponse {
  message: string;
  record_id?: string;
}

export class OffsetAPIService {
  constructor() {}

  /**
   * Estimates the carbon offset based on cart data using the custom HTTP service.
   * @param subtotal The total price of the cart.
   * @returns Observable resolving to EstimateOffsetResponse.
   */
  estimateOffset(subtotal: number): Observable<EstimateOffsetResponse> {
    const payload = { products: [{ price: subtotal, quantity: 1 }] };
    return HTTP.post(`${BACKEND_URL}/api/estimate-offset`, payload);
  }

  /**
   * Tracks customer opt-ins and estimated offsets using the custom HTTP service.
   * @param payload Data for tracking opt-in.
   * @returns Observable resolving to TrackOptInResponse.
   */
  trackOptIn(payload: TrackOptInPayload): Observable<TrackOptInResponse> {
    return HTTP.post(`${BACKEND_URL}/api/track-opt-in`, payload);
  }
}
