import { Injectable } from '@angular/core';
import { Cliente } from '../models/Cliente.interface';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


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
    return this.http.get<Cliente>(this.URL+"/"+id).
    pipe(
      catchError(e=>{
        console.error(e.error.mensaje)
        Swal.fire('Error al listar cliente',e.error.mensaje,'error')
        return throwError(e);
      })
    )
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
