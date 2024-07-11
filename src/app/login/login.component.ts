import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  messagesService = inject(MessagesService);
  router = inject(Router);
  form = this.fb.group({
    email: [''],
    password: [''],
  });

  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage('Enter email and password', 'error');
        return;
      }
      await this.authService.login(email, password);
      await this.router.navigate(['home']);

    } catch (err) {
      console.error(err);
      this.messagesService.showMessage('login failed', 'error');
    }
  }
}
