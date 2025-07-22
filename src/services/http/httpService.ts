import { Observable } from 'rxjs';

export class HTTP {
  static get(url: string): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      const request = new XMLHttpRequest();
      request.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(this.response));
        } else {
          reject('Failed');
        }
      };
      request.onerror = function () {
        reject('Failed');
      };
      request.open('GET', url);
      request.send();
    });
  }

  static post(url: string, data: any): Observable<any> {
    return new Observable<any>((observer) => {
      const request = new XMLHttpRequest();
      request.open('POST', url, true);
      request.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status >= 200 && this.status < 300) {
            observer.next(JSON.parse(this.response));
            observer.complete();
          } else {
            observer.error('Posting to server failed');
          }
        }
      };
      request.onerror = function () {
        observer.error(new Error('XMLHttpRequest Error: ' + this.statusText));
      };
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      let jsonData = JSON.stringify(data);
      request.send(jsonData);
    });
  }
}
