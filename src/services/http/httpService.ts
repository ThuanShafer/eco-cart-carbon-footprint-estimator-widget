import { Observable } from 'rxjs';

export class HTTP {
  static get(url: string, headers?: any): Observable<any> {
    return new Observable<any>((ob) => {
      const request = new XMLHttpRequest();
      request.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          try {
            ob.next(JSON.parse(this.response));
          } catch {
            ob.error('Failed');
          }
        } else {
          ob.error('Failed');
        }
      };
      request.onerror = function () {
        ob.error('Failed');
      };
      request.open('GET', url);
      if (headers) {
        headers.forEach((header: any) => {
          request.setRequestHeader(header.name, header.value);
        });
      }
      request.send();
    });
  }

  static post(url: string, data: any, headers?: any) {
    return new Observable<any>((ob) => {
      const request = new XMLHttpRequest();
      request.open('POST', url, true);
      request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
          if (this.status >= 200 && this.status < 300) {
            try {
              ob.next(JSON.parse(this.response));
            } catch {
              ob.error('Failed');
            }
          } else if (this.status == 401) {
            ob.error('session_expired');
          } else {
            ob.error('Posting to server failed');
          }
        }
      };
      request.onerror = function () {
        ob.error(new Error('XMLHttpRequest Error: ' + this.statusText));
      };
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      let jsonData = JSON.stringify(data);
      if (headers) {
        headers.forEach((header: any) => {
          request.setRequestHeader(header.name, header.value);
        });
      }
      request.send(jsonData);
    });
  }

  static getWithHeaders(url: string, headers: any): Observable<any> {
    return new Observable<any>((ob) => {
      const request = new XMLHttpRequest();
      request.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          ob.next(JSON.parse(this.response));
        } else {
          ob.error('Failed');
        }
      };
      request.onerror = function () {
        ob.error('Failed');
      };
      request.open('GET', url);
      headers.forEach((header: any) => {
        request.setRequestHeader(header.name, header.value);
      });
      request.send();
    });
  }

  static _post(url: string, data: any, headers?: any): Observable<any> {
    return new Observable<any>((ob) => {
      const request = new XMLHttpRequest();
      request.open('POST', url, true);
      request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
          if (this.status >= 200 && this.status < 300) {
            try {
              const responseData = JSON.parse(this.response);
              ob.next({
                headers: HTTP.getHeaders(request),
                data: responseData,
              });
            } catch {
              ob.error('Failed');
            }
          } else if (this.status == 401) {
            ob.error({
              code: 'session-expired',
              headers: HTTP.getHeaders(request),
            });
          } else {
            ob.error('Posting to server failed');
          }
        }
      };
      request.onerror = function () {
        ob.error(new Error('XMLHttpRequest Error: ' + this.statusText));
      };
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      let jsonData = JSON.stringify(data);
      if (headers) {
        headers.forEach((header: any) => {
          request.setRequestHeader(header.name, header.value);
        });
      }
      request.send(jsonData);
    });
  }

  private static getHeaders(request: XMLHttpRequest) {
    let headerArray = request
      .getAllResponseHeaders()
      .trim()
      .split(/[\r\n]+/);
    var headerMap = {} as any;
    headerArray.forEach(function (line) {
      var parts = line.split(': ');
      var header = parts.shift();
      var value = parts.join(': ');
      headerMap[header ?? ''] = value;
    });
    return headerMap;
  }
}
