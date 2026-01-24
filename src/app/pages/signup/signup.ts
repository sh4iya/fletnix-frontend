import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
   fullName = '';
  email = '';
  password = '';
  age!: number;

  constructor(private auth: AuthService,private router: Router ) {}

  signup() {
    if (!this.fullName || !this.email || !this.password || !this.age) {
      alert('Please fill all fields');
      return;
    }

     this.auth.signup({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      age: this.age
    }).subscribe({
      next: () => {
        alert('Signup successful. Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || 'Signup failed');
      }
    });
  }
}

