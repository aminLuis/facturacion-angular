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
  URL_img: string= "http://localhost:8080/api/cliente/upload";

  constructor(private http:HttpClient) { }

  public getClientes():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.URL);
  }

  public getCliente(id:BigInt):Observable<Cliente>{
    return this.http.get<Cliente>(this.URL+"/"+id).
    pipe(
      catchError(e=>{
        console.error(e.error.mensaje);
        this.mensaje_error('Error al listar cliente');
        return throwError(e);
      })
    )
  }

  public saveCliente(nuevo:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.URL,nuevo).
    pipe(
      tap(()=>{
        this.refresh.next();
      }),
      catchError(e=>{

        if(e.status==500){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        this.mensaje_error('Error al crear cliente');
        return throwError(e);
      })
    )
  }

  public updateCliente(data:Cliente):Observable<{}>{
    return this.http.put<Cliente>(this.URL+"/"+data.id,data).
    pipe(
      tap(()=>{
        this.refresh.next();
      }),
      catchError(e=>{

        if(e.status==500){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        this.mensaje_error('Error al editar cliente');
        return throwError(e);
      })
    )
  }

  public deleteCliente(id:BigInt):Observable<Cliente>{
    return this.http.delete<Cliente>(this.URL+"/"+id).
    pipe(
      tap(()=>{
        this.refresh.next();
      }),
      catchError(e=>{
        console.error(e.error.mensaje);
        this.mensaje_error('Error al eliminar cliente');
        return throwError(e);
      })
    )
  }

  public upload_photo(file:File,id:any):Observable<Cliente>{
    let formData = new FormData();
    formData.append("file",file);
    formData.append("id",id);

    return this.http.post<Cliente>(this.URL_img,formData).
    pipe(
      tap(()=>{
        this.refresh.next();
      }),
      catchError(e=>{
        console.error(e.error.mensaje);
        this.mensaje_error('Error al subir foto');
        console.log(e.error.mensaje);
        return throwError(e);
      })
    )
  }

  mensaje_error(texo:string){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: texo,
      //footer: '<a href="">Why do I have this issue?</a>'
    })
  }

}
