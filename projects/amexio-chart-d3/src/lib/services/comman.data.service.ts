import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule,HttpHeaders } from '@angular/common/http';

import {Observable} from 'rxjs/index';
@Injectable({
  providedIn: 'root'
})
export class CommanDataService {

  constructor(private http:HttpClient) { }
  serviceUrl: string;

  fetchUrlData(serviceUrl: string, methodType: string): Observable<any> {
    const requestJson = {};
    const headers = new HttpHeaders().append('Content-Type', 'application/json;charset=UTF-8');
    if (methodType === 'post') {
    return this.http.post(serviceUrl, requestJson, {headers});
    }else if (methodType === 'get') {
    return this.http.get(serviceUrl, {headers});
    }
}


postfetchData(serviceUrl: string, methodType: string,requestJson:any): Observable<any> {
 
  const headers = new HttpHeaders().append('Content-Type', 'application/json;charset=UTF-8');
  if (methodType === 'post') {
  return this.http.post(serviceUrl, requestJson, {headers});
  }else if (methodType === 'get') {
  return this.http.get(serviceUrl, {headers});
  }
}






}