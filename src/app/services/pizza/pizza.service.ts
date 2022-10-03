import { PizzaParams } from './../../models/pizza-list.params';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  constructor(private http: HttpClient) { }

  // api to get pizza orders
  getPizzaList(): Observable<PizzaParams[]> {
    return this.http.get<PizzaParams[]>('/api/orders');
  }

  // api to make a pizza order
  makePizza(body: PizzaParams) : Observable<PizzaParams> {
    const headers = new HttpHeaders().set(
      'Authorization',
       `Bearer ${localStorage.getItem('currentUser')}`
    );
    return this.http.post<PizzaParams>('/api/orders', body, {headers});
  }

  // api to delete a pizza order
  deletePizza(id: string) : Observable<{}> {
    const headers = new HttpHeaders().set(
      'Authorization',
       `Bearer ${localStorage.getItem('currentUser')}`
    );
    return this.http.delete<{}>(`/api/orders/${id}`, {headers});
  }
}
