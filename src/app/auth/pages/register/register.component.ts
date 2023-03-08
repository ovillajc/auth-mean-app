import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {
  // Validaciones de los campos del formulario
  miFormulario: FormGroup = this.fb.group({
    name: ['Carlos', [Validators.required, Validators.maxLength(30)]],
    email: ['admin@admin.com', [Validators.required, Validators.email]],
    password: ['ovilla12', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) {}

  register() {
    // console.log(this.miFormulario.value);
    // console.log(this.miFormulario.valid);

    const {name, email, password} = this.miFormulario.value;

    this.authService.register(name, email, password)
      .subscribe(ok => {
        if (ok === true ) {
          this.router.navigateByUrl('/dashboard');
        } else {
          Swal.fire('Error', ok, 'error');
        }
      });



  }
}
