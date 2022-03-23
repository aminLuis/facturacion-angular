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
  form_cliente_nuevo: FormGroup;
  @Input() subscription!: Subscription;

  constructor(private api_cliente:ClienteServiceService, public form:FormBuilder) {

    this.form_cliente_nuevo = form.group({
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
