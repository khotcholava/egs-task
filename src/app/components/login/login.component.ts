import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {first} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error: string = '';
  form = new FormGroup({
    username: new FormControl<string>('', {nonNullable: true}),
    password: new FormControl<string>('', {nonNullable: true}),
  });
  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
  ) {
  }

  get username() {
    return this.form.controls.username
  }

  get password() {
    return this.form.controls.password
  }

  ngOnInit(): void {
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.username.value, this.password.value).pipe(
      first(),
    ).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl)
      },
      error: error => {
        this.error = error.error.message
        this.loading = false
      }
    })
  }
}
