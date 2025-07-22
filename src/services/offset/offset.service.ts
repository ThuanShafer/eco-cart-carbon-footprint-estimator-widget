import { Observable } from 'rxjs';
import { HTTP } from '../http/httpServiceObservable';
import { map } from 'rxjs/operators';

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
   * Estimates the carbon offset based on cart data (subtotal for this prototype).
   * @param subtotal The total price of the cart.
   * @returns Promise resolving to EstimateOffsetResponse.
   */
  async estimateOffset(subtotal: number): Observable<EstimateOffsetResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/estimate-offset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Note: The backend's estimate-offset expects a 'products' array.
        // For this specific component's current logic, we'll send 'subtotal'
        // and assume the backend will adapt or you'll adjust the backend.
        // If backend expects 'products', you'd need to pass a structured cart here.
        body: JSON.stringify({ products: [{ price: subtotal, quantity: 1 }] }), // Adapting to backend's expectation
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to estimate offset: ${response.statusText} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Service: Error estimating offset:', error);
      throw error;
    }
  }

  /**
   * Tracks customer opt-ins and estimated offsets.
   * @param payload Data for tracking opt-in.
   * @returns Promise resolving to TrackOptInResponse.
   */
  async trackOptIn(payload: TrackOptInPayload): Observable<TrackOptInResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/track-opt-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to track opt-in: ${response.statusText} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Service: Error tracking opt-in:', error);
      throw error;
    }
  }
}
