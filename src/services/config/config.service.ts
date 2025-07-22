import { Observable } from 'rxjs';
import { HTTP } from '../http/httpServiceObservable';
import { map } from 'rxjs/operators';

const BACKEND_URL = 'http://127.0.0.1:5000';

interface WidgetConfig {
  placement: string;
  verbiage: string;
}

export class ConfigAPIService {
  constructor() {}

  /**
   * Fetches the widget configuration from the backend.
   * @returns Promise resolving to WidgetConfig.
   */
  async fetchWidgetConfig(): Observable<WidgetConfig> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/widget-config`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch widget config: ${response.statusText} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Service: Error fetching widget config:', error);
      throw error;
    }
  }
}
