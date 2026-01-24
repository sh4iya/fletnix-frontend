import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { setToken } from '../../services/storage.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [AuthService],
})
export class Login {

  email = '';
  password = '';
  age!: number;

constructor(private authService: AuthService,  private router: Router) {}
 
 login() {
  
  if (!this.email || !this.password) {
    alert('Please enter email and password');
    return;
  }

  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      if (res?.token) {
        setToken(res.token);

        
        this.router.navigate(['/shows']);
      } else {
        alert('Login failed');
      }
    },
    error: (err) => {
      alert(err.error?.message || 'Invalid credentials');
    }
  });
}

}