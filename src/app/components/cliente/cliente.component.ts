import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from 'src/app/models/Cliente.interface';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
      this.api_cliente.saveCliente(this.form_cliente_nuevo.value).subscribe();
      this.mensaje('Se ha registro el cliente');
      this.form_cliente_nuevo.reset();
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

  cargar_datos(cliente:Cliente){
    this.cliente = cliente;
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
