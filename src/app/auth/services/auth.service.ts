import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthResponse, Usuario } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Url del endpoint del api
  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  // optener data del usuario y desestructurar para evitar manipulación de la data accidental
  get usuario() {
    return  {...this._usuario };
  }

  constructor(private http: HttpClient) { }

  register(name: string, email: string, password: string) {
    // Idicar el endpoint a consumir
    const url = `${this.baseUrl}/auth/new`;
    // Asignar la informacion que se enviara
    const body = {name, email, password}

    // Retornar la respuesta de la petición
    return this.http.post<AuthResponse>(url, body)
        .pipe(
          tap(({ok, token}) => {
            // Si la respuesta es true asinamos la info del usuario
            if (ok) {
              localStorage.setItem('token', token!);
            }
          }),
          map(resp => resp.ok),
          catchError(err => of(err.error.msg))
        );
  }

  // Consumir el endpoint de auth
  login(email: string, password: string) {
    // Indicamos el url al cual nos comunicaremos
    const url = `${this.baseUrl}/auth`;
    // Asignamos la información que vamos a enviar
    const body = {email: email, password: password}

    // Retornamos la respuesta de la peticion
    return this.http.post<AuthResponse>(url, body)
        .pipe(
          tap(resp => {
            // Si la respuesta es true, establecemos la infroamcion a _usuario
            if ( resp.ok ) {
              // Guardar datos del usuario en el storage
              localStorage.setItem('token', resp.token!);
            }
          }),
          map( resp  => resp.ok ),
          catchError( err => of(err.error.msg) )
        );
  }


  // Validar el token del usuario
  validarToken(): Observable<boolean> {
    // Enpoint al que estamos llamando
    const url = `${this.baseUrl}/auth/renew`;
    // Creando header personalizado que se mandara al endpoint
    const headers = new HttpHeaders()
        .set('x-token', localStorage.getItem('token') || '');

    // Observable con los datos de la peticion
    // Renovamos el token enviando el header y cacheamos la respuesta y el error en caso de ser false
    return this.http.get<AuthResponse>(url, {headers: headers})
        .pipe(
          map( resp => {
            // Guardar datos del usuario en el storage
            localStorage.setItem('token', resp.token!);
            this._usuario = {
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!,
            }
            return resp.ok;
          }),
          catchError(err => of(false))
        );
  }

  logout() {
    localStorage.removeItem('token');
  }

}
