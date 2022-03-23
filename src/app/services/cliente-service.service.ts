import { Injectable } from '@angular/core';
import { Cliente } from '../models/Cliente.interface';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteServiceService {

  private refresh = new Subject<void>();

  get reload(){
    return this.refresh;
  }

  URL: string = "http://localhost:8080/api/cliente";

  constructor(private http:HttpClient) { }

  public getClientes():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.URL);
  }

  public getCliente(id:BigInt):Observable<Cliente>{
    return this.http.get<Cliente>(this.URL+"/"+id);
  }

  public saveCliente(nuevo:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.URL,nuevo).
    pipe(
      tap(()=>{
        this.refresh.next();
      })
    )
  }

  public updateCliente(data:Cliente):Observable<{}>{
    return this.http.put<Cliente>(this.URL+"/"+data.id,data).
    pipe(
      tap(()=>{
        this.refresh.next();
      })
    )
  }

  public deleteCliente(id:BigInt):Observable<Cliente>{
    return this.http.delete<Cliente>(this.URL+"/"+id).
    pipe(
      tap(()=>{
        this.refresh.next();
      })
    )
  }

}
