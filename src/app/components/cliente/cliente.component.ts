import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from 'src/app/models/Cliente.interface';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {


  clientes: Cliente[]=[];
  @Input() cliente!: Cliente;
  form_cliente_nuevo: FormGroup;
  form_cliente_editar:FormGroup;
  @Input() subscription!: Subscription;
  errores: string[]=[];
  @Input() foto_seleccionada!: any;
  progress: number = 0;

  constructor(private api_cliente:ClienteServiceService, public form:FormBuilder) {

    this.form_cliente_nuevo = form.group({
      nombre:['',Validators.required],
      apellidos:['',Validators.required],
      email:['',Validators.compose([Validators.email, Validators.required])]
    });

    this.form_cliente_editar = form.group({
      nombre:['',Validators.required],
      apellidos:['',Validators.required],
      email:['',Validators.compose([Validators.email, Validators.required])]
    });

   }


  ngOnInit(): void {
    this.listar_clientes();
    this.subscription = this.api_cliente.reload.subscribe(()=>{
      this.listar_clientes();
    });
  }


  listar_clientes(){
    this.api_cliente.getClientes().subscribe(data=>{
      this.clientes = data;
    })
  }

  save_cliente(){
    if(this.form_cliente_nuevo.valid){
      this.api_cliente.saveCliente(this.form_cliente_nuevo.value).subscribe(cliente =>{
        this.mensaje('Se ha registro el cliente');
        this.form_cliente_nuevo.reset();
      },
      err=>{
        this.errores = err.error.response as string[];
        console.log(err.error);
      }

      );

      
    }else{
       this.mensaje_error('Hay campos vacios o el formato email no es valido');
    }

  }

  update_cliente(){
    if(this.form_cliente_editar.valid){
      this.api_cliente.updateCliente(this.cliente).subscribe();
      this.mensaje('Se ha actualizado el cliente');
    }else{
      this.mensaje_error('Formulacio no valido');
    }
  }

  delete_cliente(id:BigInt){
    Swal.fire({
      title: '¿Seguro que desea eliminar el registro?',
      text: "El registro se eliminará permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api_cliente.deleteCliente(id).subscribe();
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        )
      }
    })
  
}

 seleccionar_foto(event:Event){
  this.foto_seleccionada = (<HTMLInputElement>event.target).files;
  console.log(this.foto_seleccionada[0])

  if(this.foto_seleccionada[0].type.indexOf('image')<0){
    this.mensaje_error('Archivo seleccionado no es de tipo Imagen');
    this.foto_seleccionada = null;
  }
 }

 subir_foto(){
  if(this.foto_seleccionada==null){
    this.mensaje_error('No ha seleccionado una foto aún');
  }else{

    if(this.foto_seleccionada[0].type=="image/png"){
      this.mensaje_error('Formato png no soportado');
    }else{
      this.api_cliente.upload_photo(this.foto_seleccionada[0],this.cliente.id).subscribe(event=>{

        
        if(event.type === HttpEventType.UploadProgress){

          if(event.total){
            this.progress = Math.round((event.loaded/event.total)*100);
          }

        }else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.cliente = response.cliente as Cliente;
          this.mensaje('Se ha subido la imagen: '+this.foto_seleccionada[0].name);
          this.listar_clientes();
        }

        
      });
    }

    
  }

 }

  cargar_datos(cliente:Cliente){
    this.cliente = cliente;
  }

  iniciar_progress(){
    this.progress = 0;
  }


  mensaje(texto: string){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: texto,
      showConfirmButton: false,
      timer: 1800
    })
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
