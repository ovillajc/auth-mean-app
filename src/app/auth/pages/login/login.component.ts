import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  // Validaciones de los campos del formulario
  miFormulario: FormGroup = this.fb.group({
    email: ['admin@admin.com', [Validators.required, Validators.email]],
    password: ['ovilla12', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) {}

  login() {
    console.log(this.miFormulario.value);
    // console.log(this.miFormulario.valid);
    const {email, password} = this.miFormulario.value

    // Llamamos al servicio que nos provee la conexion con el endpoint
    this.authService.login(email, password)
        .subscribe(ok => { // Suscribirse al servicio
          if ( ok === true ) {
            this.router.navigateByUrl('/dashboard');
          } else {
            // mostrar mensaje de error
            Swal.fire('Error', ok, 'error');
          }
        });

    // this.router.navigateByUrl('/dashboard');
  }
}
