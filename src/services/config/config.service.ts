import { Observable } from 'rxjs';
import { HTTP } from '../http/httpService';

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
  fetchWidgetConfig(): Observable<WidgetConfig> {
    return HTTP.get(`${BACKEND_URL}/api/widget-config`);
  }
}
